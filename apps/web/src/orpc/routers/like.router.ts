import { ORPCError } from '@orpc/client'
import { and, eq, postLikes, posts, sql } from '@repo/db'

import { getAnonKey } from '@/utils/get-anon-key'
import { getIp } from '@/utils/get-ip'

import { cache } from '../cache'
import { publicProcedure } from '../root'
import {
  countLikeInputSchema,
  countLikeOutputSchema,
  incrementLikeInputSchema,
  incrementLikeOutputSchema
} from '../schemas/like.schema'

export const countLike = publicProcedure
  .input(countLikeInputSchema)
  .output(countLikeOutputSchema)
  .handler(async ({ input, context }) => {
    const ip = getIp(context.headers)
    const anonKey = getAnonKey(ip)

    // Check cache for both global and user-specific like counts
    const [cachedLikes, cachedUserLikes] = await Promise.all([
      cache.posts.likes.get(input.slug),
      cache.posts.userLikes.get(input.slug, anonKey)
    ])

    // If both are cached, return immediately
    if (cachedLikes !== null && cachedUserLikes !== null) {
      return {
        likes: cachedLikes,
        currentUserLikes: cachedUserLikes
      }
    }

    // Fetch missing data from DB
    const [[post], [user]] = await Promise.all([
      cachedLikes === null
        ? context.db.select({ likes: posts.likes }).from(posts).where(eq(posts.slug, input.slug))
        : Promise.resolve([null]),
      cachedUserLikes === null
        ? context.db
            .select({ likeCount: postLikes.likeCount })
            .from(postLikes)
            .where(and(eq(postLikes.postId, input.slug), eq(postLikes.anonKey, anonKey)))
        : Promise.resolve([null])
    ])

    if (cachedLikes === null && !post) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Post not found'
      })
    }

    const likes = cachedLikes ?? post!.likes
    const currentUserLikes = cachedUserLikes ?? user?.likeCount ?? 0

    // Cache any missing values
    const cachePromises = []
    if (cachedLikes === null) {
      cachePromises.push(cache.posts.likes.set(likes, input.slug))
    }
    if (cachedUserLikes === null) {
      cachePromises.push(cache.posts.userLikes.set(currentUserLikes, input.slug, anonKey))
    }
    await Promise.all(cachePromises)

    return {
      likes,
      currentUserLikes
    }
  })

export const incrementLike = publicProcedure
  .input(incrementLikeInputSchema)
  .output(incrementLikeOutputSchema)
  .handler(async ({ input, context }) => {
    const ip = getIp(context.headers)
    const anonKey = getAnonKey(ip)

    const [post, currentUserLikes] = await context.db.transaction(async (tx) => {
      // Validate post existence first
      const [existingPost] = await tx.select({ slug: posts.slug }).from(posts).where(eq(posts.slug, input.slug))

      if (!existingPost) {
        throw new ORPCError('NOT_FOUND', {
          message: 'Post not found'
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
            sql`${postLikes.likeCount} + ${input.value} <= 3`
          )
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
            message: 'You can only like a post 3 times'
          })
        }

        // Insert with conflict handling to prevent race conditions
        const [inserted] = await tx
          .insert(postLikes)
          .values({ postId: input.slug, anonKey, likeCount: input.value })
          .onConflictDoUpdate({
            target: [postLikes.postId, postLikes.anonKey],
            set: { likeCount: sql`${postLikes.likeCount} + ${input.value}` }
          })
          .returning()

        if (!inserted) {
          throw new ORPCError('INTERNAL_SERVER_ERROR', {
            message: 'Failed to insert like record'
          })
        }

        // Validate limit after insert/update (transaction will rollback if exceeded)
        if (inserted.likeCount > 3) {
          throw new ORPCError('BAD_REQUEST', {
            message: 'You can only like a post 3 times'
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
        message: 'Failed to increment like'
      })
    }

    // Update both global and user-specific like caches
    await Promise.all([
      cache.posts.likes.set(post.likes, input.slug),
      cache.posts.userLikes.set(currentUserLikes.likeCount, input.slug, anonKey)
    ])

    return {
      likes: post.likes,
      currentUserLikes: currentUserLikes.likeCount
    }
  })
