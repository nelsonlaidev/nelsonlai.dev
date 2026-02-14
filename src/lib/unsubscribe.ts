import 'server-only'

import { and, eq } from 'drizzle-orm'
import { jwtVerify, SignJWT } from 'jose'
import * as z from 'zod'

import { db } from '@/db'
import { comments, unsubscribes } from '@/db/schemas'
import { env } from '@/lib/env'
import { getMaskedEmail } from '@/utils/get-masked-email'

const TokenSchema = z.jwt({ alg: 'HS256' })

const CommentReplyUnsubPayloadSchema = z.object({
  type: z.literal('comment_reply'),
  userId: z.string().min(1),
  commentId: z.string().min(1),
})

const UnsubPayloadSchema = z.discriminatedUnion('type', [CommentReplyUnsubPayloadSchema])

type UnsubTokenResult<T> = { success: true; data: T } | { success: false }
type UnsubPayload = z.infer<typeof UnsubPayloadSchema>
type CommentReplyUnsubPayload = z.infer<typeof CommentReplyUnsubPayloadSchema>

async function generateUnsubToken(payload: UnsubPayload): Promise<string> {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(new TextEncoder().encode(env.JWT_SECRET))
}

export async function verifyUnsubToken(token: string): Promise<UnsubTokenResult<UnsubPayload>> {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }

  const parsedToken = TokenSchema.safeParse(token)

  if (!parsedToken.success) {
    return { success: false }
  }

  try {
    const decoded = await jwtVerify(token, new TextEncoder().encode(env.JWT_SECRET), { algorithms: ['HS256'] })

    const parsedPayload = UnsubPayloadSchema.safeParse(decoded.payload)

    if (!parsedPayload.success) {
      return { success: false }
    }

    return { success: true, data: parsedPayload.data }
  } catch {
    return { success: false }
  }
}

export async function generateCommentReplyUnsubToken(userId: string, commentId: string): Promise<string> {
  return generateUnsubToken({
    type: 'comment_reply',
    userId,
    commentId,
  })
}

async function getCommentReplyUnsubData(payload: CommentReplyUnsubPayload, token: string) {
  const { userId, commentId } = payload

  const data = await db.query.comments.findFirst({
    where: and(eq(comments.userId, userId), eq(comments.id, commentId)),
    with: {
      user: {
        columns: { email: true },
      },
    },
    columns: { body: true },
  })

  if (!data) return null

  const isUnsubscribed = await db.query.unsubscribes.findFirst({
    where: and(
      eq(unsubscribes.userId, userId),
      eq(unsubscribes.commentId, commentId),
      eq(unsubscribes.type, 'comment_reply'),
    ),
  })

  const maskedEmail = getMaskedEmail(data.user.email)

  return {
    type: 'comment_reply' as const,
    comment: data.body,
    userEmail: maskedEmail,
    token,
    isUnsubscribed: Boolean(isUnsubscribed),
    userId,
    commentId,
  }
}

export async function getUnsubData(token: string | null) {
  if (!token) return null

  const result = await verifyUnsubToken(token)

  if (!result.success) return null

  const { data } = result

  // Allow for future types
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (data.type) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    case 'comment_reply': {
      return getCommentReplyUnsubData(data, token)
    }
    default: {
      return null
    }
  }
}
