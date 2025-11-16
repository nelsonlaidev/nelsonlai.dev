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

    const cached = await cache.posts.likes.get(input.slug, anonKey)
    if (cached) return cached

    const [[post], [user]] = await Promise.all([
      context.db.select({ likes: posts.likes }).from(posts).where(eq(posts.slug, input.slug)),
      context.db
        .select({ likes: postLikes.likeCount })
        .from(postLikes)
        .where(and(eq(postLikes.postId, input.slug), eq(postLikes.anonKey, anonKey)))
    ])

    if (!post) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Post not found'
      })
    }

    const likesData = {
      likes: post.likes,
      currentUserLikes: user?.likes ?? 0 // The case that user has not liked the post yet
    }

    await cache.posts.likes.set(likesData, input.slug, anonKey)

    return likesData
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

        if (existing) {
          // Record exists but limit would be exceeded
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

    const likesData = {
      likes: post.likes,
      currentUserLikes: currentUserLikes.likeCount
    }

    await cache.posts.likes.set(likesData, input.slug, anonKey)

    return likesData
  })
