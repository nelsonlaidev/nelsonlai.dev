import { publicProcedure } from '../procedures'
import { GetPostStatsInputSchema, GetPostStatsOutputSchema } from '../schema/posts'

const getStats = publicProcedure
  .input(GetPostStatsInputSchema)
  .output(GetPostStatsOutputSchema)
  .handler(async ({ input, context }) => {
    if (input.slugs.length === 0) return []

    return context.db.query.posts.findMany({
      columns: { slug: true, likes: true, views: true },
      where: { slug: { in: input.slugs } },
      orderBy: { slug: 'asc' },
    })
  })

export const postsRouter = {
  stats: getStats,
}
