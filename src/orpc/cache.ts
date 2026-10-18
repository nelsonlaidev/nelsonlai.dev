import type * as z from 'zod'
import type { GithubStatsOutputSchema } from './schemas/github.schema'

import { createCache } from '@/lib/kv'

const LOCATION_CACHE_TTL = 60 * 60 * 6 // 6 hours
const GITHUB_STATS_CACHE_TTL = 60 * 60 // 1 hour

export const cache = {
  posts: {
    views: createCache<number>('posts:views'),
    likes: createCache<number>('posts:likes'),
    userLikes: createCache<number>('posts:user-likes'),
  },
  auth: {
    location: createCache<string>('auth:location', LOCATION_CACHE_TTL),
  },
  github: createCache<z.infer<typeof GithubStatsOutputSchema>>('github', GITHUB_STATS_CACHE_TTL),
}
