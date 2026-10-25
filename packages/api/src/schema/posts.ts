import * as z from 'zod'

export const GetPostStatsInputSchema = z.object({
  slugs: z.array(z.string().trim().min(1)).max(50),
})

export const GetPostStatsOutputSchema = z.array(
  z.object({
    slug: z.string(),
    likes: z.number().int().nonnegative(),
    views: z.number().int().nonnegative(),
  }),
)
