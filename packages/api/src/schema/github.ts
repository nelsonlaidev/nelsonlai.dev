import * as z from 'zod'

export const GetRepositoryStatsOutputSchema = z.object({
  stars: z.number().int().nonnegative(),
})
