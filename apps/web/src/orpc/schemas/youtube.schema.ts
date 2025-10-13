import * as z from 'zod'

export const youtubeStatsOutputSchema = z.object({
  subscribers: z.number(),
  views: z.number()
})
