import { cache } from '../cache'
import { octokit } from '../lib/octokit'
import { publicProcedure } from '../procedures'
import { GithubRepositoryStatsSchema, GithubStatsSchema } from '../schema/github'

const GITHUB_USERNAME = 'nelsonlaidev'
const GITHUB_REPO = 'nelsonlai.dev'
const REPOSITORY_CACHE_KEY = `${GITHUB_USERNAME}:${GITHUB_REPO}`

function getRequestOptions() {
  return {
    headers: { 'X-GitHub-Api-Version': '2026-03-10' },
    request: { signal: AbortSignal.timeout(10_000) },
  }
}

const getRepositoryStats = publicProcedure.output(GithubRepositoryStatsSchema).handler(async () => {
  const cached = await cache.github.repositoryStats.get(REPOSITORY_CACHE_KEY)
  if (cached !== null) return cached

  const { data: repository } = await octokit.rest.repos.get({
    owner: GITHUB_USERNAME,
    repo: GITHUB_REPO,
    ...getRequestOptions(),
  })

  const result = { stars: repository.stargazers_count }

  await cache.github.repositoryStats.set(REPOSITORY_CACHE_KEY, result)

  return result
})

const getStats = publicProcedure.output(GithubStatsSchema).handler(async () => {
  const cached = await cache.github.stats.get(GITHUB_USERNAME)
  if (cached !== null) return cached

  const [repos, { data: user }] = await Promise.all([
    octokit.paginate(octokit.rest.repos.listForUser, {
      username: GITHUB_USERNAME,
      per_page: 100,
      ...getRequestOptions(),
    }),
    octokit.rest.users.getByUsername({
      username: GITHUB_USERNAME,
      ...getRequestOptions(),
    }),
  ])

  const result = {
    stars: repos.reduce((total, repo) => total + (repo.stargazers_count ?? 0), 0),
    followers: user.followers,
  }

  await cache.github.stats.set(GITHUB_USERNAME, result)

  return result
})

export const githubRouter = {
  repositoryStats: getRepositoryStats,
  stats: getStats,
}
