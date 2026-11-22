import { ORPCError } from '@orpc/server'
import { users } from '@repo/db/schema/auth'
import { commentNotificationPreferences, commentReplyUnsubscribes, comments } from '@repo/db/schema/comments'
import { and, eq, sql } from 'drizzle-orm'
import * as z from 'zod'

import { verifyReplyUnsubscribeToken } from '../lib/comment-notifications'
import { getMaskedEmail } from '../lib/get-masked-email'
import { protectedProcedure, publicProcedure } from '../procedures'
import { EmailNotificationPreferencesSchema, UnsubscribeTokenInputSchema } from '../schema/comments'

const getEmailPreferences = protectedProcedure
  .output(EmailNotificationPreferencesSchema)
  .handler(async ({ context }) => {
    const [preference] = await context.db
      .select({ commentRepliesEnabled: commentNotificationPreferences.commentRepliesEnabled })
      .from(commentNotificationPreferences)
      .where(eq(commentNotificationPreferences.userId, context.session.user.id))

    return preference ?? { commentRepliesEnabled: true }
  })

const setEmailPreferences = protectedProcedure
  .input(EmailNotificationPreferencesSchema)
  .output(z.void())
  .handler(async ({ input, context }) => {
    await context.db
      .insert(commentNotificationPreferences)
      .values({ userId: context.session.user.id, ...input })
      .onConflictDoUpdate({ target: commentNotificationPreferences.userId, set: input })
  })

const inspectUnsubscribe = publicProcedure
  .input(UnsubscribeTokenInputSchema)
  .output(z.object({ comment: z.string(), isUnsubscribed: z.boolean(), userEmail: z.string() }))
  .handler(async ({ input, context }) => {
    const payload = await verifyReplyUnsubscribeToken(input.token)
    if (!payload) {
      throw new ORPCError('BAD_REQUEST')
    }

    const [comment] = await context.db
      .select({
        body: comments.body,
        userEmail: users.email,
        isUnsubscribed: sql<boolean>`${commentReplyUnsubscribes.commentId} is not null`,
      })
      .from(comments)
      .innerJoin(users, eq(users.id, comments.userId))
      .leftJoin(
        commentReplyUnsubscribes,
        and(eq(commentReplyUnsubscribes.commentId, comments.id), eq(commentReplyUnsubscribes.userId, payload.userId)),
      )
      .where(and(eq(comments.id, payload.commentId), eq(comments.userId, payload.userId)))

    if (!comment) {
      throw new ORPCError('NOT_FOUND')
    }

    return {
      comment: comment.body,
      isUnsubscribed: comment.isUnsubscribed,
      userEmail: getMaskedEmail(comment.userEmail),
    }
  })

const unsubscribeFromCommentReplies = publicProcedure
  .input(UnsubscribeTokenInputSchema)
  .output(z.void())
  .handler(async ({ input, context }) => {
    const payload = await verifyReplyUnsubscribeToken(input.token)
    if (!payload) {
      throw new ORPCError('BAD_REQUEST')
    }

    await context.db.transaction(async (tx) => {
      const [comment] = await tx
        .select({ id: comments.id })
        .from(comments)
        .where(and(eq(comments.id, payload.commentId), eq(comments.userId, payload.userId)))
        .for('update')

      if (!comment) {
        throw new ORPCError('NOT_FOUND')
      }

      await tx
        .insert(commentReplyUnsubscribes)
        .values({ userId: payload.userId, commentId: payload.commentId })
        .onConflictDoNothing()
    })
  })

export const notificationsRouter = {
  getEmailPreferences,
  setEmailPreferences,
  inspectUnsubscribe,
  unsubscribeFromCommentReplies,
}
