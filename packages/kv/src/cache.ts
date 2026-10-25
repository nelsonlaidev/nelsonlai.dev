import type * as z from 'zod'

import { redis } from './redis'

export function createCache<TValue>(prefix: string, schema: z.ZodType<TValue>, ttl: number) {
  return {
    async get(key: string): Promise<TValue | null> {
      const fullKey = `${prefix}:${key}`

      try {
        const value = await redis.get<unknown>(fullKey)
        if (value === null) return null

        const parsed = schema.safeParse(value)
        if (parsed.success) return parsed.data

        console.warn('[Cache] Invalid value:', fullKey)
      } catch {
        console.warn('[Cache] Read failed:', fullKey)
      }

      return null
    },

    async set(key: string, value: TValue, customTtl: number = ttl): Promise<void> {
      const fullKey = `${prefix}:${key}`
      const parsed = schema.parse(value)

      try {
        await redis.set(fullKey, parsed, { ex: customTtl })
      } catch {
        console.warn('[Cache] Write failed:', fullKey)
      }
    },

    async del(key: string): Promise<void> {
      const fullKey = `${prefix}:${key}`

      try {
        await redis.del(fullKey)
      } catch {
        console.warn('[Cache] Delete failed:', fullKey)
      }
    },
  }
}
