import { and, count, eq, isNotNull } from 'drizzle-orm'

import { comments } from '@/db/schemas'

import { publicProcedure } from '@/orpc/procedures'
import { CountReplyInputSchema, CountReplyOutputSchema } from '@/orpc/schemas/reply.schema'

const countReply = publicProcedure
  .input(CountReplyInputSchema)
  .output(CountReplyOutputSchema)
  .handler(async ({ input, context }) => {
    const [result] = await context.db
      .select({
        value: count(),
      })
      .from(comments)
      .where(and(eq(comments.postId, input.slug), isNotNull(comments.parentId)))

    return {
      count: result?.value ?? 0,
    }
  })

export const replyRouter = {
  count: countReply,
}
