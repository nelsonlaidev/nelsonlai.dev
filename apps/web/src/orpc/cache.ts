import type { CountLikeOutput, CountViewOutput } from './routers'

import { createCache } from '@repo/kv'

export const cache = {
  posts: {
    views: createCache<CountViewOutput, [string]>(['posts', 'views']),
    likes: createCache<CountLikeOutput, [string, string]>(['posts', 'likes'])
  }
}
