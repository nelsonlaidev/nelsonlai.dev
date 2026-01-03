import { ORPCError } from '@orpc/client'
import { eq, posts, sql } from '@repo/db'

import { cache } from '../cache'
import { publicProcedure } from '../root'
import {
  CountViewInputSchema,
  CountViewOutputSchema,
  IncrementViewInputSchema,
  IncrementViewOutputSchema
} from '../schemas/view.schema'

export const countView = publicProcedure
  .input(CountViewInputSchema)
  .output(CountViewOutputSchema)
  .handler(async ({ input, context }) => {
    const cached = await cache.posts.views.get(input.slug)
    if (cached) {
      return {
        views: cached
      }
    }

    const [post] = await context.db.select({ views: posts.views }).from(posts).where(eq(posts.slug, input.slug))

    if (!post) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Post not found'
      })
    }

    const views = post.views

    await cache.posts.views.set(input.slug, views)

    return {
      views
    }
  })

export const incrementView = publicProcedure
  .input(IncrementViewInputSchema)
  .output(IncrementViewOutputSchema)
  .handler(async ({ input, context }) => {
    const [result] = await context.db
      .insert(posts)
      .values({
        slug: input.slug,
        views: 1
      })
      .onConflictDoUpdate({
        target: posts.slug,
        set: {
          views: sql`${posts.views} + 1`
        }
      })
      .returning()

    if (!result) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to increment view'
      })
    }

    const views = result.views

    await cache.posts.views.set(input.slug, views)

    return {
      views
    }
  })
