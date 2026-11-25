import * as z from 'zod'

export const YoutubeStatsSchema = z.object({
  subscribers: z.number().int().nonnegative(),
  views: z.number().int().nonnegative(),
})
