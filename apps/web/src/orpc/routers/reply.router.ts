import { and, comments, count, eq, isNotNull } from '@repo/db'

import { publicProcedure } from '../root'
import { countRepliesInputSchema, countRepliesOutputSchema } from '../schemas/reply.schema'

export const countReplies = publicProcedure
  .input(countRepliesInputSchema)
  .output(countRepliesOutputSchema)
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
