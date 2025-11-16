import type { CountViewOutput } from './routers'

import { createCache } from '@repo/kv'

const LOCATION_CACHE_TTL = 60 * 60 * 6 // 6 hours

export const cache = {
  posts: {
    views: createCache<CountViewOutput, [slug: string]>(['posts', 'views']),
    likes: createCache<number, [slug: string]>(['posts', 'likes']),
    userLikes: createCache<number, [slug: string, anonKey: string]>(['posts', 'user-likes'])
  },
  auth: {
    location: createCache<string, [ip: string]>(['auth', 'location'], LOCATION_CACHE_TTL)
  }
}
