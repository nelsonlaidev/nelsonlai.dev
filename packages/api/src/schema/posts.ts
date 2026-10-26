import * as z from 'zod'

export const PostStatsInputSchema = z.object({
  slugs: z.array(z.string().trim().min(1)).max(50),
})

export const PostStatsListSchema = z.array(
  z.object({
    slug: z.string(),
    likes: z.number().int().nonnegative(),
    views: z.number().int().nonnegative(),
  }),
)

export const PostTotalsSchema = z.object({
  likes: z.number().int().nonnegative(),
  views: z.number().int().nonnegative(),
})
