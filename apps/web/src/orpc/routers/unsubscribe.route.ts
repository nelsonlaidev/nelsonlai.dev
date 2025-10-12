import { ORPCError } from '@orpc/client'
import { createId } from '@paralleldrive/cuid2'
import { and, eq, unsubscribes } from '@repo/db'

import { verifyReplyUnsubToken } from '@/lib/unsubscribe'

import { protectedProcedure, publicProcedure } from '../root'
import { emptyOutputSchema } from '../schemas/common.schema'
import {
  getReplyNotificationPrefsOutputSchema,
  updateGlobalReplyNotificationPrefsInputSchema,
  updateReplyNotificationPrefsInputSchema
} from '../schemas/unsubscribes.schema'

export const getReplyNotificationPrefs = protectedProcedure
  .output(getReplyNotificationPrefsOutputSchema)
  .handler(async ({ context }) => {
    const result = await context.db.query.unsubscribes.findFirst({
      where: and(eq(unsubscribes.userId, context.session.user.id), eq(unsubscribes.type, 'all'))
    })

    return { isEnabled: result ? false : true }
  })

export const updateGlobalReplyNotificationPrefs = protectedProcedure
  .input(updateGlobalReplyNotificationPrefsInputSchema)
  .output(emptyOutputSchema)
  .handler(async ({ context, input }) => {
    if (input.isEnabled) {
      await context.db
        .delete(unsubscribes)
        .where(and(eq(unsubscribes.userId, context.session.user.id), eq(unsubscribes.type, 'all')))

      return
    }

    const existing = await context.db.query.unsubscribes.findFirst({
      where: and(eq(unsubscribes.userId, context.session.user.id), eq(unsubscribes.type, 'all'))
    })

    if (!existing) {
      await context.db.insert(unsubscribes).values({
        id: createId(),
        userId: context.session.user.id,
        type: 'all'
      })
    }
  })

export const updateReplyNotificationPrefs = publicProcedure
  .input(updateReplyNotificationPrefsInputSchema)
  .output(emptyOutputSchema)
  .handler(async ({ input, context }) => {
    const { success } = await verifyReplyUnsubToken(input.token)

    if (!success) {
      throw new ORPCError('BAD_REQUEST', { message: 'Invalid token' })
    }

    const existing = await context.db.query.unsubscribes.findFirst({
      where: and(
        eq(unsubscribes.userId, input.userId),
        eq(unsubscribes.commentId, input.commentId),
        eq(unsubscribes.type, 'comment')
      )
    })

    if (existing) {
      throw new ORPCError('CONFLICT', {
        message: 'You have already unsubscribed from notifications for this comment'
      })
    }

    await context.db.insert(unsubscribes).values({
      id: createId(),
      userId: input.userId,
      commentId: input.commentId,
      type: 'comment'
    })
  })
