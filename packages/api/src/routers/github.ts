import { cache } from '../cache'
import { octokit } from '../lib/octokit'
import { publicProcedure } from '../procedures'
import { GithubRepositoryStatsSchema, GithubStatsSchema } from '../schema/github'

const CACHE_KEY = 'nelsonlaidev:nelsonlai.dev'

const getRepositoryStats = publicProcedure.output(GithubRepositoryStatsSchema).handler(async () => {
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

const getStats = publicProcedure.output(GithubStatsSchema).handler(async () => {
  const username = 'nelsonlaidev'
  const cached = await cache.github.stats.get(username)
  if (cached !== null) return cached

  const [repos, { data: user }] = await Promise.all([
    octokit.paginate(octokit.rest.repos.listForUser, {
      username,
      per_page: 100,
      headers: { 'X-GitHub-Api-Version': '2026-03-10' },
      request: { signal: AbortSignal.timeout(10_000) },
    }),
    octokit.rest.users.getByUsername({
      username,
      headers: { 'X-GitHub-Api-Version': '2026-03-10' },
      request: { signal: AbortSignal.timeout(10_000) },
    }),
  ])

  const result = {
    stars: repos.reduce((total, repo) => total + (repo.stargazers_count ?? 0), 0),
    followers: user.followers,
  }

  await cache.github.stats.set(username, result)

  return result
})

export const githubRouter = {
  repositoryStats: getRepositoryStats,
  stats: getStats,
}
