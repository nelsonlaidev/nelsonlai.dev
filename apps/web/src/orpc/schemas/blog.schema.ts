import * as z from 'zod'

export const viewsStatsOutputSchema = z.object({
  views: z.number()
})

export const likesStatsOutputSchema = z.object({
  likes: z.number()
})
