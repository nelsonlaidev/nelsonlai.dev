import { randomUUID } from 'node:crypto'
import { isIP } from 'node:net'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { ORPCError } from '@orpc/server'
import { sessions } from '@repo/db/schema/auth'
import { and, eq, gt } from 'drizzle-orm'
import sharp from 'sharp'
import * as z from 'zod'

import { cache } from '../cache'
import { ENV } from '../env'
import { getCloudflareR2 } from '../lib/cloudflare-r2'
import { protectedProcedure } from '../procedures'
import {
  AccountSessionsSchema,
  RevokeSessionInputSchema,
  UpdateAvatarInputSchema,
  UpdateNameInputSchema,
} from '../schema/account'

async function resolveSessionLocation(ip: string | null) {
  if (!ip || !isIP(ip)) return null

  const cached = await cache.account.location.get(ip)
  if (cached !== null) return cached || null

  try {
    const response = await fetch(`https://api.nelsonlai.dev/ip/geo?ip=${encodeURIComponent(ip)}`, {
      headers: ENV.NELSONLAI_API_KEY ? { 'x-api-key': ENV.NELSONLAI_API_KEY } : {},
      signal: AbortSignal.timeout(3000),
    })
    if (!response.ok) return null

    const parsed = z.object({ country: z.string(), region: z.string() }).safeParse(await response.json())
    if (!parsed.success) return null

    const location = [parsed.data.region, parsed.data.country].filter(Boolean).join(', ')
    await cache.account.location.set(ip, location)
    return location || null
  } catch {
    return null
  }
}

const listSessions = protectedProcedure.output(AccountSessionsSchema).handler(async ({ context }) => {
  const activeSessions = await context.db
    .select({
      id: sessions.id,
      ipAddress: sessions.ipAddress,
      userAgent: sessions.userAgent,
      updatedAt: sessions.updatedAt,
    })
    .from(sessions)
    .where(and(eq(sessions.userId, context.session.user.id), gt(sessions.expiresAt, new Date())))

  const locations = new Map(
    await Promise.all(
      [...new Set(activeSessions.map((session) => session.ipAddress))].map(
        async (ip) => [ip, await resolveSessionLocation(ip)] as const,
      ),
    ),
  )

  return activeSessions
    .map((session) => ({
      ...session,
      ipAddress: session.ipAddress === '' ? null : session.ipAddress,
      userAgent: session.userAgent === '' ? null : session.userAgent,
      isCurrentSession: session.id === context.session.session.id,
      location: locations.get(session.ipAddress) ?? null,
    }))
    .toSorted(
      (a, b) =>
        Number(b.isCurrentSession) - Number(a.isCurrentSession) || b.updatedAt.getTime() - a.updatedAt.getTime(),
    )
})

const revokeSession = protectedProcedure
  .input(RevokeSessionInputSchema)
  .output(z.object({ isCurrentSession: z.boolean() }))
  .handler(async ({ input, context }) => {
    const isCurrentSession = input.id === context.session.session.id

    if (isCurrentSession) {
      await context.auth.api.signOut({ headers: context.headers })
    } else {
      const [session] = await context.db
        .select({ token: sessions.token })
        .from(sessions)
        .where(and(eq(sessions.id, input.id), eq(sessions.userId, context.session.user.id)))

      if (!session) throw new ORPCError('NOT_FOUND')

      await context.auth.api.revokeSession({ headers: context.headers, body: { token: session.token } })
    }

    return { isCurrentSession }
  })

const updateName = protectedProcedure
  .input(UpdateNameInputSchema)
  .output(z.void())
  .handler(async ({ input, context }) => {
    await context.auth.api.updateUser({ headers: context.headers, body: input })
  })

const updateAvatar = protectedProcedure
  .input(UpdateAvatarInputSchema)
  .output(z.void())
  .handler(async ({ input, context }) => {
    const bytes = Buffer.from(await input.arrayBuffer())
    const image = sharp(bytes, { animated: true, limitInputPixels: 16_777_216 })

    const { format } = await image.metadata().catch(() => {
      throw new ORPCError('BAD_REQUEST', { message: 'Invalid avatar image.' })
    })

    if (`image/${format}` !== input.type) {
      throw new ORPCError('BAD_REQUEST', { message: 'Avatar content does not match its media type.' })
    }

    // Decode the pixels as well as the header before allowing the original file into storage.
    await image
      .raw()
      .toBuffer()
      .catch(() => {
        throw new ORPCError('BAD_REQUEST', { message: 'Invalid avatar image.' })
      })

    const { client, bucketName, publicUrl } = getCloudflareR2()
    const extension = format === 'jpeg' ? 'jpg' : format
    const key = `avatars/${context.session.user.id}/${randomUUID()}.${extension}`
    await client.send(new PutObjectCommand({ Bucket: bucketName, Key: key, Body: bytes, ContentType: input.type }))
    await context.auth.api.updateUser({ headers: context.headers, body: { image: `${publicUrl}/${key}` } })
  })

export const accountRouter = { listSessions, revokeSession, updateName, updateAvatar }
