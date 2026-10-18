import { Octokit } from '@octokit/rest'

import { ENV } from '@/env'

export const octokit = new Octokit({ auth: ENV.GITHUB_TOKEN })
