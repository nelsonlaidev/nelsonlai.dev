import * as z from 'zod'

export const GithubRepositoryStatsSchema = z.object({
  stars: z.number().int().nonnegative(),
})

export const GithubStatsSchema = z.object({
  stars: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
})
