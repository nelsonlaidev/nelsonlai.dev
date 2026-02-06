import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { consola } from 'consola'

import { env } from '@/lib/env'

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '10 s'),
  analytics: true,
})

const DEFAULT_TTL = 60 * 60 * 24 // 1 day

export function createCache<T>(prefix: string, ttl: number = DEFAULT_TTL) {
  function getKey(...parts: Array<string | number>) {
    return [prefix, ...parts].filter(Boolean).join(':')
  }

  return {
    async get(key: string): Promise<T | null> {
      const fullKey = getKey(key)
      try {
        return await redis.get<T>(fullKey)
      } catch (error) {
        consola.error('[Cache] Get failed:', fullKey, error)
        return null
      }
    },

    async set(key: string, value: T, customTtl?: number): Promise<void> {
      const fullKey = getKey(key)
      try {
        await redis.set(fullKey, value, { ex: customTtl ?? ttl })
      } catch (error) {
        consola.error('[Cache] Set failed:', fullKey, error)
      }
    },

    async del(key: string): Promise<void> {
      const fullKey = getKey(key)
      try {
        await redis.del(fullKey)
      } catch (error) {
        consola.error('[Cache] Delete failed:', fullKey, error)
      }
    },

    async invalidate(pattern?: string): Promise<void> {
      try {
        const fullPattern = pattern ? getKey(pattern) : `${prefix}:*`
        const keys = await redis.keys(fullPattern)
        if (keys.length > 0) {
          await redis.del(...keys)
        }
      } catch (error) {
        consola.error('[Cache] Invalidate failed:', error)
      }
    },

    async getOrSet(key: string, factory: () => Promise<T>, customTtl?: number): Promise<T> {
      const cached = await this.get(key)
      if (cached !== null) return cached

      const value = await factory()
      await this.set(key, value, customTtl)

      return value
    },
  }
}
