import { ORPCError } from '@orpc/client'
import { createId } from '@paralleldrive/cuid2'
import { and, eq, notifications } from '@repo/db'

import { verifyReplyUnsubToken } from '@/lib/unsubscribe'

import { protectedProcedure, publicProcedure } from '../root'
import { emptyOutputSchema } from '../schemas/common.schema'
import {
  getCommentReplyPrefsOutputSchema,
  updateCommentReplyPrefsInputSchema,
  updateGlobalReplyPrefsInputSchema
} from '../schemas/notification.schema'

export const getReplyPrefs = protectedProcedure
  .output(getCommentReplyPrefsOutputSchema)
  .handler(async ({ context }) => {
    const result = await context.db.query.notifications.findFirst({
      where: and(eq(notifications.userId, context.session.user.id), eq(notifications.type, 'all'))
    })

    return { isEnabled: result ? false : true }
  })

export const updateReplyPrefs = protectedProcedure
  .input(updateGlobalReplyPrefsInputSchema)
  .output(emptyOutputSchema)
  .handler(async ({ context, input }) => {
    if (input.isEnabled) {
      await context.db
        .delete(notifications)
        .where(and(eq(notifications.userId, context.session.user.id), eq(notifications.type, 'all')))

      return
    }

    const existing = await context.db.query.notifications.findFirst({
      where: and(eq(notifications.userId, context.session.user.id), eq(notifications.type, 'all'))
    })

    if (!existing) {
      await context.db.insert(notifications).values({
        id: createId(),
        userId: context.session.user.id,
        type: 'all'
      })
    }
  })

export const updateCommentReplyPrefs = publicProcedure
  .input(updateCommentReplyPrefsInputSchema)
  .output(emptyOutputSchema)
  .handler(async ({ input, context }) => {
    const { success } = await verifyReplyUnsubToken(input.token)

    if (!success) {
      throw new ORPCError('BAD_REQUEST', { message: 'Invalid token' })
    }

    const existing = await context.db.query.notifications.findFirst({
      where: and(
        eq(notifications.userId, input.userId),
        eq(notifications.commentId, input.commentId),
        eq(notifications.type, 'comment')
      )
    })

    if (existing) {
      throw new ORPCError('CONFLICT', {
        message: 'You have already unsubscribed from notifications for this comment'
      })
    }

    await context.db.insert(notifications).values({
      id: createId(),
      userId: input.userId,
      commentId: input.commentId,
      type: 'comment'
    })
  })
