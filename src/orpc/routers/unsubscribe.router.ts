import { ORPCError } from '@orpc/client'
import { createId } from '@paralleldrive/cuid2'
import { and, eq } from 'drizzle-orm'

import { unsubscribes } from '@/db/schemas'

import { publicProcedure } from '../procedures'
import { EmptyOutputSchema } from '../schemas/common.schema'
import { UnsubscribeTokenInputSchema } from '../schemas/unsubscribe.schema'

const createCommentReplyUnsubscribe = publicProcedure
  .input(UnsubscribeTokenInputSchema)
  .output(EmptyOutputSchema)
  .handler(async ({ input, context }) => {
    const { verifyUnsubToken } = await import('@/lib/unsubscribe')
    const result = await verifyUnsubToken(input.token)

    // Future types may be added
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!result.success || result.data.type !== 'comment_reply') {
      throw new ORPCError('BAD_REQUEST', { message: 'Invalid token' })
    }

    const { userId, commentId } = result.data

    const existing = await context.db.query.unsubscribes.findFirst({
      where: and(
        eq(unsubscribes.userId, userId),
        eq(unsubscribes.commentId, commentId),
        eq(unsubscribes.type, 'comment_reply'),
      ),
    })

    if (existing) {
      throw new ORPCError('CONFLICT', {
        message: 'You have already unsubscribed from notifications for this comment',
      })
    }

    await context.db.insert(unsubscribes).values({
      id: createId(),
      userId,
      commentId,
      type: 'comment_reply',
    })
  })

export const unsubscribeRouter = {
  createCommentReply: createCommentReplyUnsubscribe,
}
