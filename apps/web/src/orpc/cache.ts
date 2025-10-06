import type { CountLikeOutput, CountViewOutput } from './routers'

import { createCache } from '@repo/kv'

const LOCATION_CACHE_TTL = 60 * 60 * 6 // 6 hours

export const cache = {
  posts: {
    views: createCache<CountViewOutput, [string]>(['posts', 'views']),
    likes: createCache<CountLikeOutput, [string, string]>(['posts', 'likes'])
  },
  auth: {
    location: createCache<string, [string]>(['auth', 'location'], LOCATION_CACHE_TTL)
  }
}
