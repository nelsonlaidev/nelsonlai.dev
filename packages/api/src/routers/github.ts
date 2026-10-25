import { cache } from '../cache'
import { octokit } from '../lib/octokit'
import { publicProcedure } from '../procedures'
import { GetRepositoryStatsOutputSchema } from '../schema/github'

const CACHE_KEY = 'nelsonlaidev:nelsonlai.dev'

const getRepositoryStats = publicProcedure.output(GetRepositoryStatsOutputSchema).handler(async () => {
  const cached = await cache.github.repositoryStats.get(CACHE_KEY)
  if (cached !== null) return cached

  const { data: repository } = await octokit.rest.repos.get({
    owner: 'nelsonlaidev',
    repo: 'nelsonlai.dev',
    headers: {
      'X-GitHub-Api-Version': '2026-03-10',
    },
    request: { signal: AbortSignal.timeout(10_000) },
  })

  const result = { stars: repository.stargazers_count }

  await cache.github.repositoryStats.set(CACHE_KEY, result)

  return result
})

export const githubRouter = {
  repositoryStats: getRepositoryStats,
}
