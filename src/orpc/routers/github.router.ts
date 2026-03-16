import { GITHUB_USERNAME } from '@/constants/site'
import { octokit } from '@/lib/octokit'

import { cache } from '../cache'
import { publicProcedure } from '../procedures'
import { GithubStatsOutputSchema } from '../schemas/github.schema'

const CACHE_KEY = 'stats'

const getStats = publicProcedure.output(GithubStatsOutputSchema).handler(async () => {
  const cached = await cache.github.get(CACHE_KEY)
  if (cached) return cached

  const [repos, { data: user }, { data: repo }] = await Promise.all([
    octokit.paginate('GET /users/{username}/repos', {
      username: GITHUB_USERNAME,
      per_page: 100,
    }),
    octokit.request('GET /users/{username}', {
      username: GITHUB_USERNAME,
    }),
    octokit.request('GET /repos/{owner}/{repo}', {
      owner: GITHUB_USERNAME,
      repo: 'nelsonlai.dev',
    }),
  ])

  const stars = repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0)

  const result = {
    stars,
    followers: user.followers,
    repoStars: repo.stargazers_count,
  }

  await cache.github.set(CACHE_KEY, result)

  return result
})

export const githubRouter = {
  stats: getStats,
}
