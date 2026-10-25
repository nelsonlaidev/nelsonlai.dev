import { createCache } from '@repo/kv'
import * as z from 'zod'

import { GetRepositoryStatsOutputSchema } from './schema/github'

const GITHUB_REPOSITORY_STATS_TTL = 5 * 60
const SPOTIFY_ACCESS_TOKEN_TTL = 60 * 60

export const cache = {
  github: {
    repositoryStats: createCache('github:repository', GetRepositoryStatsOutputSchema, GITHUB_REPOSITORY_STATS_TTL),
  },
  spotify: {
    accessToken: createCache('spotify:access-token', z.string().min(1), SPOTIFY_ACCESS_TOKEN_TTL),
  },
}
