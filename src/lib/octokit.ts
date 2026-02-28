import { Octokit } from '@octokit/rest'

import { env } from '@/env'

export const octokit = new Octokit({ auth: env.GITHUB_TOKEN })
