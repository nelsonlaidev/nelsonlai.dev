import { and, comments, count, eq, isNotNull } from '@repo/db'

import { publicProcedure } from '../root'
import { CountRepliesInputSchema, CountRepliesOutputSchema } from '../schemas/reply.schema'

export const countReplies = publicProcedure
  .input(CountRepliesInputSchema)
  .output(CountRepliesOutputSchema)
  .handler(async ({ input, context }) => {
    const [result] = await context.db
      .select({
        value: count()
      })
      .from(comments)
      .where(and(eq(comments.postId, input.slug), isNotNull(comments.parentId)))

    return {
      count: result?.value ?? 0
    }
  })
