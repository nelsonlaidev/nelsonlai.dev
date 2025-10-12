import { ORPCError } from '@orpc/client'
import { createId } from '@paralleldrive/cuid2'
import { and, eq, unsubscribes } from '@repo/db'

import { verifyReplyUnsubToken } from '@/lib/unsubscribe'

import { protectedProcedure, publicProcedure } from '../root'
import { emptyOutputSchema } from '../schemas/common.schema'
import {
  getCommentReplyPrefsOutputSchema,
  updateCommentReplyPrefsInputSchema,
  updateGlobalReplyPrefsInputSchema
} from '../schemas/unsubscribe.schema'

export const getReplyPrefs = protectedProcedure
  .output(getCommentReplyPrefsOutputSchema)
  .handler(async ({ context }) => {
    const result = await context.db.query.unsubscribes.findFirst({
      where: and(eq(unsubscribes.userId, context.session.user.id), eq(unsubscribes.scope, 'comment_replies_user'))
    })

    return { isEnabled: result ? false : true }
  })

export const updateReplyPrefs = protectedProcedure
  .input(updateGlobalReplyPrefsInputSchema)
  .output(emptyOutputSchema)
  .handler(async ({ context, input }) => {
    if (input.isEnabled) {
      await context.db
        .delete(unsubscribes)
        .where(and(eq(unsubscribes.userId, context.session.user.id), eq(unsubscribes.scope, 'comment_replies_user')))

      return
    }

    const existing = await context.db.query.unsubscribes.findFirst({
      where: and(eq(unsubscribes.userId, context.session.user.id), eq(unsubscribes.scope, 'comment_replies_user'))
    })

    if (!existing) {
      await context.db.insert(unsubscribes).values({
        id: createId(),
        userId: context.session.user.id,
        scope: 'comment_replies_user'
      })
    }
  })

export const updateCommentReplyPrefs = publicProcedure
  .input(updateCommentReplyPrefsInputSchema)
  .output(emptyOutputSchema)
  .handler(async ({ input, context }) => {
    const result = await verifyReplyUnsubToken(input.token)

    if (!result.success) {
      throw new ORPCError('BAD_REQUEST', { message: 'Invalid token' })
    }

    const { userId, commentId } = result.data

    const existing = await context.db.query.unsubscribes.findFirst({
      where: and(
        eq(unsubscribes.userId, userId),
        eq(unsubscribes.commentId, commentId),
        eq(unsubscribes.scope, 'comment_replies_comment')
      )
    })

    if (existing) {
      throw new ORPCError('CONFLICT', {
        message: 'You have already unsubscribed from notifications for this comment'
      })
    }

    await context.db.insert(unsubscribes).values({
      id: createId(),
      userId,
      commentId,
      scope: 'comment_replies_comment'
    })
  })
