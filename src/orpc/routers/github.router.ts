import { GITHUB_USERNAME } from '@/lib/constants'
import { octokit } from '@/lib/octokit'

import { publicProcedure } from '../procedures'
import { GithubStatsOutputSchema } from '../schemas/github.schema'

const githubStats = publicProcedure.output(GithubStatsOutputSchema).handler(async () => {
  if (!octokit) {
    return {
      stars: 0,
      followers: 0,
      repoStars: 0,
    }
  }

  const repos = await octokit.paginate('GET /users/{username}/repos', {
    username: GITHUB_USERNAME,
    per_page: 100,
  })

  const stars = repos.reduce((sum, repo) => sum + (repo.stargazers_count ?? 0), 0)

  const { data: user } = await octokit.request('GET /users/{username}', {
    username: GITHUB_USERNAME,
  })

  const { followers } = user

  const { data: repo } = await octokit.request('GET /repos/{owner}/{repo}', {
    owner: GITHUB_USERNAME,
    repo: 'nelsonlai.dev',
  })

  return {
    stars,
    followers,
    repoStars: repo.stargazers_count,
  }
})

export const githubRouter = {
  stats: githubStats,
}
