import { createCache } from '@/lib/kv'

const LOCATION_CACHE_TTL = 60 * 60 * 6 // 6 hours

export const cache = {
  posts: {
    views: createCache<number>('posts:views'),
    likes: createCache<number>('posts:likes'),
    userLikes: createCache<number>('posts:user-likes'),
  },
  auth: {
    location: createCache<string>('auth:location', LOCATION_CACHE_TTL),
  },
}
