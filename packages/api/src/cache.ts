import { createCache } from '@repo/kv'
import * as z from 'zod'

import { GithubRepositoryStatsSchema, GithubStatsSchema } from './schema/github'
import { WakatimeStatsSchema } from './schema/wakatime'
import { YoutubeStatsSchema } from './schema/youtube'

const GITHUB_REPOSITORY_STATS_TTL = 5 * 60
const GITHUB_STATS_TTL = 60 * 60
const WAKATIME_STATS_TTL = 5 * 60
const YOUTUBE_STATS_TTL = 60 * 60
const SPOTIFY_ACCESS_TOKEN_TTL = 60 * 60

export const cache = {
  account: {
    location: createCache('account:location', z.string(), 24 * 60 * 60),
  },
  github: {
    repositoryStats: createCache('github:repository', GithubRepositoryStatsSchema, GITHUB_REPOSITORY_STATS_TTL),
    stats: createCache('github:user', GithubStatsSchema, GITHUB_STATS_TTL),
  },
  spotify: {
    accessToken: createCache('spotify:access-token', z.string().min(1), SPOTIFY_ACCESS_TOKEN_TTL),
  },
  wakatime: {
    stats: createCache('wakatime:stats', WakatimeStatsSchema, WAKATIME_STATS_TTL),
  },
  youtube: {
    stats: createCache('youtube:channel', YoutubeStatsSchema, YOUTUBE_STATS_TTL),
  },
}
