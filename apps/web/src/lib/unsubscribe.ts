import 'server-only'

import { and, comments, db, eq, unsubscribes } from '@repo/db'
import { env } from '@repo/env'
import { jwtVerify, SignJWT } from 'jose'
import * as z from 'zod'

import { getMaskedEmail } from '@/utils/get-masked-email'

const tokenSchema = z.jwt({ alg: 'HS256' })

const replyUnsubPayloadSchema = z.object({
  userId: z.string().min(1),
  commentId: z.string().min(1)
})

type UnsubTokenResult<T> = { success: true; data: T } | { success: false }
type ReplyUnsubPayload = z.infer<typeof replyUnsubPayloadSchema>

export const generateReplyUnsubToken = (userId: string, commentId: string): Promise<string> => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }

  return new SignJWT({ userId, commentId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(new TextEncoder().encode(env.JWT_SECRET))
}

export const verifyReplyUnsubToken = async (token: string): Promise<UnsubTokenResult<ReplyUnsubPayload>> => {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set')
  }

  const parsedToken = tokenSchema.safeParse(token)

  if (!parsedToken.success) {
    return { success: false }
  }

  try {
    const decoded = await jwtVerify(token, new TextEncoder().encode(env.JWT_SECRET), { algorithms: ['HS256'] })

    const parsedPayload = replyUnsubPayloadSchema.safeParse(decoded.payload)

    if (!parsedPayload.success) {
      return { success: false }
    }

    return { success: true, data: parsedPayload.data }
  } catch {
    return { success: false }
  }
}

export const getReplyUnsubData = async (token: string | null) => {
  if (!token) return null

  const result = await verifyReplyUnsubToken(token)

  if (!result.success) return null

  const { userId, commentId } = result.data

  const data = await db.query.comments.findFirst({
    where: and(eq(comments.userId, userId), eq(comments.id, commentId)),
    with: {
      user: {
        columns: { email: true }
      }
    },
    columns: { body: true }
  })

  if (!data) return null

  const isUnsubscribed = await db.query.unsubscribes.findFirst({
    where: and(
      eq(unsubscribes.userId, userId),
      eq(unsubscribes.commentId, commentId),
      eq(unsubscribes.scope, 'comment_replies_comment')
    )
  })

  const maskedEmail = getMaskedEmail(data.user.email)

  return {
    comment: data.body,
    userEmail: maskedEmail,
    token,
    isUnsubscribed: !!isUnsubscribed,
    ...result.data
  }
}
