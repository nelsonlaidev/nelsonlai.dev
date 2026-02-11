import { ORPCError } from '@orpc/client'
import { and, eq } from 'drizzle-orm'

import { votes } from '@/db/schemas'

import { protectedProcedure } from '../procedures'
import { CreateVoteInputSchema, CreateVoteOutputSchema } from '../schemas/vote.schema'

const createVote = protectedProcedure
  .input(CreateVoteInputSchema)
  .output(CreateVoteOutputSchema)
  .handler(async ({ input, context }) => {
    const { user } = context.session

    if (input.isLike === null) {
      const [vote] = await context.db
        .delete(votes)
        .where(and(eq(votes.commentId, input.id), eq(votes.userId, user.id)))
        .returning()

      if (!vote) {
        throw new ORPCError('INTERNAL_SERVER_ERROR', {
          message: 'Failed to delete vote',
        })
      }

      return vote
    }

    const [vote] = await context.db
      .insert(votes)
      .values({
        commentId: input.id,
        userId: user.id,
        isLike: input.isLike,
      })
      .onConflictDoUpdate({
        target: [votes.userId, votes.commentId],
        set: {
          isLike: input.isLike,
        },
      })
      .returning()

    if (!vote) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to create vote',
      })
    }

    return vote
  })

export const voteRouter = {
  create: createVote,
}
