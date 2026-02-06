import { ORPCError } from '@orpc/client'
import { APIError } from 'better-auth'

import { auth } from '@/lib/auth'
import { getLocation } from '@/utils/get-location'

import { cache } from '../cache'
import { protectedProcedure } from '../procedures'
import { ListSessionsOutputSchema, RevokeSessionInputSchema, UpdateUserInputSchema } from '../schemas/auth.schema'
import { EmptyOutputSchema } from '../schemas/common.schema'

async function resolveLocation(ip: string) {
  const cached = await cache.auth.location.get(ip)
  if (cached) return cached

  const location = await getLocation(ip)

  if (location !== null) {
    await cache.auth.location.set(ip, location)
  }

  return location
}

const listSessions = protectedProcedure.output(ListSessionsOutputSchema).handler(async ({ context }) => {
  const sessions = await auth.api.listSessions({
    headers: context.headers,
  })

  const result = await Promise.all(
    sessions.map(async (session) => ({
      ...session,
      // See https://github.com/better-auth/better-auth/issues/443
      // type mismatch between better-auth and drizzle
      ipAddress: (session.ipAddress ?? '') || null,
      userAgent: (session.userAgent ?? '') || null,
      isCurrentSession: session.id === context.session.session.id,
      location: session.ipAddress ? await resolveLocation(session.ipAddress) : null,
    })),
  )

  return {
    sessions: result,
  }
})

const revokeSession = protectedProcedure
  .input(RevokeSessionInputSchema)
  .output(EmptyOutputSchema)
  .handler(async ({ input, context }) => {
    try {
      await auth.api.revokeSession({
        headers: context.headers,
        body: { token: input.token },
      })
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 'UNAUTHORIZED') throw new ORPCError('UNAUTHORIZED')
        if (error.status === 'BAD_REQUEST') throw new ORPCError('BAD_REQUEST')
      }

      throw new ORPCError('INTERNAL_SERVER_ERROR')
    }
  })

const updateUser = protectedProcedure
  .input(UpdateUserInputSchema)
  .output(EmptyOutputSchema)
  .handler(async ({ input, context }) => {
    const body: Record<string, unknown> = {}

    if (input.name !== undefined) {
      body.name = input.name
    }

    if (input.image !== undefined) {
      body.image = input.image
    }

    await auth.api.updateUser({
      headers: context.headers,
      body,
    })
  })

export const authRouter = {
  session: {
    list: listSessions,
    revoke: revokeSession,
  },
  user: {
    update: updateUser,
  },
}
