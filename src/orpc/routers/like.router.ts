import { ORPCError } from '@orpc/client'
import { and, eq, sql, sum } from 'drizzle-orm'

import { postLikes, posts } from '@/db/schemas'
import { getAnonKey } from '@/utils/get-anon-key'
import { getIp } from '@/utils/get-ip'

import { cache } from '../cache'
import { publicProcedure } from '../procedures'
import { LikesStatsOutputSchema } from '../schemas/blog.schema'
import {
  CountLikeInputSchema,
  CountLikeOutputSchema,
  IncrementLikeInputSchema,
  IncrementLikeOutputSchema,
} from '../schemas/like.schema'

const countLike = publicProcedure
  .input(CountLikeInputSchema)
  .output(CountLikeOutputSchema)
  .handler(async ({ input, context }) => {
    const ip = getIp(context.headers)
    const anonKey = getAnonKey(ip)

    const [cachedLikes, cachedUserLikes] = await Promise.all([
      cache.posts.likes.get(input.slug),
      cache.posts.userLikes.get(`${input.slug}:${anonKey}`),
    ])

    if (cachedLikes !== null && cachedUserLikes !== null) {
      return {
        likes: cachedLikes,
        currentUserLikes: cachedUserLikes,
      }
    }

    const [dbLikes, dbUserLikes] = await Promise.all([
      cachedLikes === null
        ? context.db
            .select({ likes: posts.likes })
            .from(posts)
            .where(eq(posts.slug, input.slug))
            .then((rows) => {
              const row = rows[0]
              if (!row) {
                throw new ORPCError('NOT_FOUND', { message: 'Post not found' })
              }
              return row.likes
            })
        : Promise.resolve(cachedLikes),
      cachedUserLikes === null
        ? context.db
            .select({ likeCount: postLikes.likeCount })
            .from(postLikes)
            .where(and(eq(postLikes.postId, input.slug), eq(postLikes.anonKey, anonKey)))
            .then((rows) => rows[0]?.likeCount ?? 0)
        : Promise.resolve(cachedUserLikes),
    ])

    const likes = cachedLikes ?? dbLikes
    const currentUserLikes = cachedUserLikes ?? dbUserLikes

    const cachePromises = []
    if (cachedLikes === null) {
      cachePromises.push(cache.posts.likes.set(input.slug, likes))
    }
    if (cachedUserLikes === null) {
      cachePromises.push(cache.posts.userLikes.set(`${input.slug}:${anonKey}`, currentUserLikes))
    }
    await Promise.all(cachePromises)

    return {
      likes,
      currentUserLikes,
    }
  })

const incrementLike = publicProcedure
  .input(IncrementLikeInputSchema)
  .output(IncrementLikeOutputSchema)
  .handler(async ({ input, context }) => {
    const ip = getIp(context.headers)
    const anonKey = getAnonKey(ip)

    const [post, currentUserLikes] = await context.db.transaction(async (tx) => {
      // Validate post existence first
      const [existingPost] = await tx.select({ slug: posts.slug }).from(posts).where(eq(posts.slug, input.slug))

      if (!existingPost) {
        throw new ORPCError('NOT_FOUND', {
          message: 'Post not found',
        })
      }

      // Try to update existing like record with atomic validation
      const updated = await tx
        .update(postLikes)
        .set({ likeCount: sql`${postLikes.likeCount} + ${input.value}` })
        .where(
          and(
            eq(postLikes.postId, input.slug),
            eq(postLikes.anonKey, anonKey),
            sql`${postLikes.likeCount} + ${input.value} <= 3`,
          ),
        )
        .returning()

      let userLikes

      if (updated.length > 0) {
        // Update succeeded
        userLikes = updated[0]
      } else {
        // Update returned 0 rows - either record doesn't exist or limit would be exceeded
        const [existing] = await tx
          .select()
          .from(postLikes)
          .where(and(eq(postLikes.postId, input.slug), eq(postLikes.anonKey, anonKey)))

        if (existing && existing.likeCount + input.value > 3) {
          // Record exists and limit would be exceeded
          throw new ORPCError('BAD_REQUEST', {
            message: 'You can only like a post 3 times',
          })
        }

        // Insert with conflict handling to prevent race conditions
        const [inserted] = await tx
          .insert(postLikes)
          .values({ postId: input.slug, anonKey, likeCount: input.value })
          .onConflictDoUpdate({
            target: [postLikes.postId, postLikes.anonKey],
            set: { likeCount: sql`${postLikes.likeCount} + ${input.value}` },
          })
          .returning()

        if (!inserted) {
          throw new ORPCError('INTERNAL_SERVER_ERROR', {
            message: 'Failed to insert like record',
          })
        }

        // Validate limit after insert/update (transaction will rollback if exceeded)
        if (inserted.likeCount > 3) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'You can only like a post 3 times',
          })
        }

        userLikes = inserted
      }

      // Update the post's total like count
      const [postResult] = await tx
        .update(posts)
        .set({ likes: sql`${posts.likes} + ${input.value}` })
        .where(eq(posts.slug, input.slug))
        .returning()

      return [postResult, userLikes]
    })

    if (!post || !currentUserLikes) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to increment like',
      })
    }

    // Update both global and user-specific like caches
    await Promise.all([
      cache.posts.likes.set(input.slug, post.likes),
      cache.posts.userLikes.set(`${input.slug}:${anonKey}`, currentUserLikes.likeCount),
    ])

    return {
      likes: post.likes,
      currentUserLikes: currentUserLikes.likeCount,
    }
  })

const likesStats = publicProcedure.output(LikesStatsOutputSchema).handler(async ({ context }) => {
  const [result] = await context.db
    .select({
      value: sum(posts.likes),
    })
    .from(posts)

  const likes = result?.value ? Number(result.value) : 0

  return {
    likes,
  }
})

export const likeRouter = {
  count: countLike,
  increment: incrementLike,
  stats: likesStats,
}
