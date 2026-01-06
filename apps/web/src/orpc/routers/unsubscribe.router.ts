import { ORPCError } from '@orpc/client'
import { createId } from '@paralleldrive/cuid2'
import { and, eq, unsubscribes } from '@repo/db'

import { verifyReplyUnsubToken } from '@/lib/unsubscribe'

import { publicProcedure } from '../orpc'
import { EmptyOutputSchema } from '../schemas/common.schema'
import { CreateCommentUnsubscribeInputSchema } from '../schemas/unsubscribe.schema'

export const createCommentUnsubscribe = publicProcedure
  .input(CreateCommentUnsubscribeInputSchema)
  .output(EmptyOutputSchema)
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

export const unsubscribeRouter = {
  createComment: createCommentUnsubscribe
}
