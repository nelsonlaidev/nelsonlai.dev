import * as z from 'zod'

export const GithubStatsOutputSchema = z.object({
  stars: z.number(),
  followers: z.number(),
  repoStars: z.number(),
})
