import type { Session } from '@repo/auth'
import type { Database } from '@repo/db'
import type { Context } from '../context'

import { users } from '@repo/db/schema/auth'
import { commentNotificationPreferences, commentReplyUnsubscribes, comments } from '@repo/db/schema/comments'
import { CommentEmailTemplate, ReplyEmailTemplate, sendEmail } from '@repo/email'
import { and, eq } from 'drizzle-orm'
import { jwtVerify, SignJWT } from 'jose'
import { createElement } from 'react'
import * as z from 'zod'

import settings from '../../../../apps/web/project.inlang/settings.json'
import { ENV } from '../env'

const REPLY_UNSUBSCRIBE_AUDIENCE = 'comment-reply-unsubscribe'

const ReplyUnsubscribePayloadSchema = z.object({
  type: z.literal('comment_reply'),
  userId: z.string().min(1),
  commentId: z.string().min(1),
})

export async function createReplyUnsubscribeToken(userId: string, commentId: string) {
  return new SignJWT({ type: 'comment_reply', userId, commentId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ENV.SITE_URL)
    .setAudience(REPLY_UNSUBSCRIBE_AUDIENCE)
    .setExpirationTime('30d')
    .sign(new TextEncoder().encode(ENV.JWT_SECRET))
}

export async function verifyReplyUnsubscribeToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(ENV.JWT_SECRET), {
      algorithms: ['HS256'],
    })

    if (payload.iss !== ENV.SITE_URL || payload.aud !== REPLY_UNSUBSCRIBE_AUDIENCE) return null

    const result = ReplyUnsubscribePayloadSchema.safeParse(payload)
    return result.success ? result.data : null
  } catch {
    return null
  }
}

async function findReplyRecipient(db: Database, parentId: string, replierId: string) {
  const [recipient] = await db
    .select({
      userId: users.id,
      email: users.email,
      parentCommentBody: comments.body,
      commentRepliesEnabled: commentNotificationPreferences.commentRepliesEnabled,
      unsubscribedCommentId: commentReplyUnsubscribes.commentId,
    })
    .from(comments)
    .innerJoin(users, eq(users.id, comments.userId))
    .leftJoin(commentNotificationPreferences, eq(commentNotificationPreferences.userId, users.id))
    .leftJoin(
      commentReplyUnsubscribes,
      and(eq(commentReplyUnsubscribes.userId, users.id), eq(commentReplyUnsubscribes.commentId, comments.id)),
    )
    .where(eq(comments.id, parentId))

  if (!recipient?.userId || !recipient.email || recipient.userId === replierId) return null
  if (recipient.commentRepliesEnabled === false || recipient.unsubscribedCommentId) return null

  return recipient
}

export async function notifyComment(
  comment: typeof comments.$inferSelect,
  user: Session['user'],
  post: Context['posts'][number],
  db: Database,
) {
  if (!import.meta.env.PROD) return

  try {
    const { locale, title } = post
    const localePrefix = locale === settings.baseLocale ? '' : `/${encodeURIComponent(locale)}`
    const postUrl = new URL(`${localePrefix}/blog/${encodeURIComponent(comment.postSlug)}`, ENV.SITE_URL)
    const commentUrl = new URL(postUrl)
    commentUrl.searchParams.set('comment', comment.parentId ?? comment.id)

    const userImage = user.image ?? new URL(`/api/avatar/${encodeURIComponent(user.id)}.webp`, ENV.SITE_URL).href
    const sharedTemplateProps = {
      postTitle: title,
      postUrl: postUrl.href,
      siteUrl: ENV.SITE_URL,
      date: comment.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
      }),
    }

    if (!comment.parentId) {
      const authorEmail = ENV.AUTHOR_EMAIL
      if (!authorEmail || user.role === 'admin' || user.email === authorEmail) return

      await sendEmail({
        to: authorEmail,
        subject: `New comment on "${title}"`,
        react: createElement(CommentEmailTemplate, {
          ...sharedTemplateProps,
          comment: comment.body,
          commenterName: user.name,
          commenterImage: userImage,
          commentUrl: commentUrl.href,
        }),
      })
      return
    }

    const recipient = await findReplyRecipient(db, comment.parentId, user.id)
    if (!recipient) return

    commentUrl.searchParams.set('reply', comment.id)
    const token = await createReplyUnsubscribeToken(recipient.userId, comment.parentId)
    const unsubscribeUrl = new URL('/unsubscribe', ENV.SITE_URL)
    unsubscribeUrl.searchParams.set('token', token)

    await sendEmail({
      to: recipient.email,
      subject: `New reply to your comment on "${title}"`,
      react: createElement(ReplyEmailTemplate, {
        ...sharedTemplateProps,
        comment: recipient.parentCommentBody,
        reply: comment.body,
        replierName: user.name,
        replierImage: userImage,
        replyUrl: commentUrl.href,
        unsubscribeUrl: unsubscribeUrl.href,
      }),
    })
  } catch (error) {
    console.warn('[Comments] Notification could not be delivered', error)
  }
}
