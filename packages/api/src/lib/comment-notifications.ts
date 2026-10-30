import type { Session } from '@repo/auth'
import type { Database } from '@repo/db'
import type { comments } from '@repo/db/schema/comments'
import type { ReactElement } from 'react'
import type { Context } from '../context'

import { users } from '@repo/db/schema/auth'
import {
  commentNotificationPreferences,
  commentReplyUnsubscribes,
  comments as commentTable,
} from '@repo/db/schema/comments'
import { CommentEmailTemplate, ReplyEmailTemplate, sendEmail } from '@repo/email'
import { and, eq } from 'drizzle-orm'
import { jwtVerify, SignJWT } from 'jose'
import { createElement } from 'react'
import * as z from 'zod'

import { ENV } from '../env'

const ReplyUnsubscribePayloadSchema = z.object({
  type: z.literal('comment_reply'),
  userId: z.string().min(1),
  commentId: z.string().min(1),
})

export async function createReplyUnsubscribeToken(userId: string, commentId: string) {
  return new SignJWT({ type: 'comment_reply', userId, commentId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ENV.SITE_URL)
    .setAudience('comment-reply-unsubscribe')
    .setExpirationTime('30d')
    .sign(new TextEncoder().encode(ENV.JWT_SECRET ?? ENV.BETTER_AUTH_SECRET))
}

export async function verifyReplyUnsubscribeToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(ENV.JWT_SECRET ?? ENV.BETTER_AUTH_SECRET), {
      algorithms: ['HS256'],
    })
    const legacyToken = payload.iss === undefined && payload.aud === undefined
    if (!legacyToken && (payload.iss !== ENV.SITE_URL || payload.aud !== 'comment-reply-unsubscribe')) return null
    const result = ReplyUnsubscribePayloadSchema.safeParse(payload)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

export async function notifyComment(
  comment: typeof comments.$inferSelect,
  user: Session['user'],
  post: Context['posts'][number],
  db: Database,
) {
  if (ENV.NODE_ENV !== 'production') return

  try {
    const { locale, title } = post
    const prefix = locale === 'en' ? '' : `/${encodeURIComponent(locale)}`
    const postUrl = new URL(`${prefix}/blog/${encodeURIComponent(comment.postId)}`, ENV.SITE_URL).href
    const url = new URL(postUrl)
    url.searchParams.set('comment', comment.parentId ?? comment.id)
    if (comment.parentId) url.searchParams.set('reply', comment.id)

    let recipient = ENV.AUTHOR_EMAIL
    let subject = `New comment on "${title}"`
    const commonProps = {
      postTitle: title,
      postUrl,
      siteUrl: ENV.SITE_URL,
      date: comment.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      }),
    }
    const image = user.image ?? new URL(`/api/avatar/${encodeURIComponent(user.id)}.webp`, ENV.SITE_URL).href
    let template: ReactElement = createElement(CommentEmailTemplate, {
      ...commonProps,
      comment: comment.body,
      commenterName: user.name,
      commenterImage: image,
      commentUrl: url.href,
    })

    if (comment.parentId) {
      const [parent] = await db
        .select({
          userId: commentTable.userId,
          email: users.email,
          body: commentTable.body,
          repliesEnabled: commentNotificationPreferences.repliesEnabled,
          unsubscribe: commentReplyUnsubscribes.commentId,
        })
        .from(commentTable)
        .innerJoin(users, eq(users.id, commentTable.userId))
        .leftJoin(commentNotificationPreferences, eq(commentNotificationPreferences.userId, users.id))
        .leftJoin(
          commentReplyUnsubscribes,
          and(eq(commentReplyUnsubscribes.userId, users.id), eq(commentReplyUnsubscribes.commentId, commentTable.id)),
        )
        .where(eq(commentTable.id, comment.parentId))
      if (!parent?.userId || parent.userId === user.id || parent.repliesEnabled === false || parent.unsubscribe) return
      recipient = parent.email
      subject = `New reply to your comment on "${title}"`
      const unsubscribeUrl = new URL('/unsubscribe', ENV.SITE_URL)
      unsubscribeUrl.searchParams.set('token', await createReplyUnsubscribeToken(parent.userId, comment.parentId))
      template = createElement(ReplyEmailTemplate, {
        ...commonProps,
        reply: comment.body,
        replierName: user.name,
        replierImage: image,
        comment: parent.body,
        replyUrl: url.href,
        unsubscribeUrl: unsubscribeUrl.href,
      })
    } else if (user.role === 'admin' || user.email === recipient) {
      return
    }

    if (!recipient) return
    await sendEmail({ to: recipient, subject, react: template })
  } catch (error) {
    console.warn('[Comments] Notification could not be delivered', error)
  }
}
