import * as z from 'zod'

export const githubStatsOutputSchema = z.object({
  stars: z.number(),
  followers: z.number(),
  repoStars: z.number()
})
