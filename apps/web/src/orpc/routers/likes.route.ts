import { ORPCError } from '@orpc/client'
import { eq, postLikes, posts, sql } from '@repo/db'

import { getIp } from '@/utils/get-ip'
import { getSessionId } from '@/utils/get-session-id'

import { cache } from '../cache'
import { publicProcedure } from '../root'
import {
  countLikeInputSchema,
  countLikeOutputSchema,
  incrementLikeInputSchema,
  incrementLikeOutputSchema
} from '../schemas/likes.schema'

export const countLike = publicProcedure
  .input(countLikeInputSchema)
  .output(countLikeOutputSchema)
  .handler(async ({ input, context }) => {
    const ip = getIp(context.headers)
    const sessionId = getSessionId(input.slug, ip)

    const cached = await cache.posts.likes.get(input.slug, sessionId)
    if (cached) return cached

    const [[post], [user]] = await Promise.all([
      context.db.select({ likes: posts.likes }).from(posts).where(eq(posts.slug, input.slug)),
      context.db.select({ likes: postLikes.likes }).from(postLikes).where(eq(postLikes.id, sessionId))
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

    await cache.posts.likes.set(likesData, input.slug, sessionId)

    return likesData
  })

export const incrementLike = publicProcedure
  .input(incrementLikeInputSchema)
  .output(incrementLikeOutputSchema)
  .handler(async ({ input, context }) => {
    const ip = getIp(context.headers)
    const sessionId = getSessionId(input.slug, ip)

    const [session] = await context.db
      .select({ likes: postLikes.likes })
      .from(postLikes)
      .where(eq(postLikes.id, sessionId))

    if (session && session.likes + input.value > 3) {
      throw new ORPCError('BAD_REQUEST', {
        message: 'You can only like a post 3 times'
      })
    }

    const [[post], [currentUserLikes]] = await context.db.transaction(async (tx) => {
      return Promise.all([
        tx
          .update(posts)
          .set({ likes: sql`${posts.likes} + ${input.value}` })
          .where(eq(posts.slug, input.slug))
          .returning(),
        tx
          .insert(postLikes)
          .values({ id: sessionId, likes: input.value })
          .onConflictDoUpdate({
            target: postLikes.id,
            set: { likes: sql`${postLikes.likes} + ${input.value}` }
          })
          .returning()
      ])
    })

    if (!post || !currentUserLikes) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to increment like'
      })
    }

    const likesData = {
      likes: post.likes,
      currentUserLikes: currentUserLikes.likes
    }

    await cache.posts.likes.set(likesData, input.slug, sessionId)

    return likesData
  })
