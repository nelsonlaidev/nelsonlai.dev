import * as z from 'zod'

export const YoutubeStatsOutputSchema = z.object({
  subscribers: z.number(),
  views: z.number(),
})
