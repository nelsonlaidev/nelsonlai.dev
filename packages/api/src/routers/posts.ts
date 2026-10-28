import { ORPCError } from '@orpc/server'
import { postLikes, posts } from '@repo/db/schema/posts'
import { and, eq, sql, sum } from 'drizzle-orm'

import { getAnonymousKey } from '../lib/anonymous-key'
import { publicProcedure } from '../procedures'
import {
  LikePostInputSchema,
  PostLikesSchema,
  PostSlugInputSchema,
  PostStatsInputSchema,
  PostStatsListSchema,
  PostTotalsSchema,
} from '../schema/posts'

const incrementView = publicProcedure
  .input(PostSlugInputSchema)
  .output(PostStatsListSchema.element)
  .handler(async ({ input, context }) => {
    if (!context.posts.some((post) => post.slug === input.slug)) throw new ORPCError('NOT_FOUND')

    const [post] = await context.db
      .insert(posts)
      .values({ slug: input.slug, views: 1 })
      .onConflictDoUpdate({ target: posts.slug, set: { views: sql`${posts.views} + 1` } })
      .returning({ slug: posts.slug, views: posts.views, likes: posts.likes })
    if (!post) throw new ORPCError('INTERNAL_SERVER_ERROR')
    return post
  })

const getLikes = publicProcedure
  .input(PostSlugInputSchema)
  .output(PostLikesSchema)
  .handler(async ({ input, context }) => {
    const [post] = await context.db
      .select({
        likes: posts.likes,
        currentUserLikes: sql<number>`coalesce(${postLikes.likeCount}, 0)`.mapWith(Number),
      })
      .from(posts)
      .leftJoin(
        postLikes,
        and(eq(postLikes.postId, posts.slug), eq(postLikes.anonKey, getAnonymousKey(context.headers))),
      )
      .where(eq(posts.slug, input.slug))
    if (!post) throw new ORPCError('NOT_FOUND')
    return post
  })

const likePost = publicProcedure
  .input(LikePostInputSchema)
  .output(PostLikesSchema)
  .handler(async ({ input, context }) => {
    const anonKey = getAnonymousKey(context.headers)
    return context.db.transaction(async (tx) => {
      const [existing] = await tx
        .select({ slug: posts.slug })
        .from(posts)
        .where(eq(posts.slug, input.slug))
        .for('update')
      if (!existing) throw new ORPCError('NOT_FOUND')

      const [record] = await tx
        .insert(postLikes)
        .values({ postId: input.slug, anonKey, likeCount: input.value })
        .onConflictDoUpdate({
          target: [postLikes.postId, postLikes.anonKey],
          set: { likeCount: sql`${postLikes.likeCount} + ${input.value}` },
          setWhere: sql`${postLikes.likeCount} + ${input.value} <= 3`,
        })
        .returning({ currentUserLikes: postLikes.likeCount })
      if (!record) throw new ORPCError('BAD_REQUEST', { message: 'You can only like a post 3 times' })

      const [post] = await tx
        .update(posts)
        .set({ likes: sql`${posts.likes} + ${input.value}` })
        .where(eq(posts.slug, input.slug))
        .returning({ likes: posts.likes })
      if (!post) throw new ORPCError('NOT_FOUND')
      return { ...post, ...record }
    })
  })

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
  incrementView,
  likes: getLikes,
  like: likePost,
  stats: getStats,
  totals: getTotals,
}
