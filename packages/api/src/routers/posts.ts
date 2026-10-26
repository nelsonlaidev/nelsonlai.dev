import { posts } from '@repo/db/schema/posts'
import { sum } from 'drizzle-orm'

import { publicProcedure } from '../procedures'
import { PostStatsInputSchema, PostStatsListSchema, PostTotalsSchema } from '../schema/posts'

const getStats = publicProcedure
  .input(PostStatsInputSchema)
  .output(PostStatsListSchema)
  .handler(async ({ input, context }) => {
    if (input.slugs.length === 0) return []

    return context.db.query.posts.findMany({
      columns: { slug: true, likes: true, views: true },
      where: { slug: { in: input.slugs } },
      orderBy: { slug: 'asc' },
    })
  })

const getTotals = publicProcedure.output(PostTotalsSchema).handler(async ({ context }) => {
  const [totals] = await context.db.select({ likes: sum(posts.likes), views: sum(posts.views) }).from(posts)

  return { likes: Number(totals?.likes ?? 0), views: Number(totals?.views ?? 0) }
})

export const postsRouter = {
  stats: getStats,
  totals: getTotals,
}
