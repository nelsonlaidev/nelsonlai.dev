import * as z from 'zod'

export const ViewsStatsOutputSchema = z.object({
  views: z.number(),
})

export const LikesStatsOutputSchema = z.object({
  likes: z.number(),
})
