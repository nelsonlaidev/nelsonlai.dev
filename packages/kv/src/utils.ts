import { consola } from 'consola'

import { redis } from './index'

type KVKey = string | string[]

const KV_TTL = 60 * 60 * 24 // 1 day

export const createKey = (parts: KVKey): string => {
  return Array.isArray(parts) ? parts.join(':') : parts
}

export const createCache = <T, A extends string[]>(keyPrefix: KVKey, ttl: number = KV_TTL) => {
  const prefixKey = createKey(keyPrefix)

  const getKey = (suffixArgs: A) => {
    if (suffixArgs.length === 0) return prefixKey

    const suffixKey = createKey(suffixArgs)
    return suffixKey ? `${prefixKey}:${suffixKey}` : prefixKey
  }

  return {
    get: async (...args: A): Promise<T | null> => {
      const key = getKey(args)
      consola.info('[Cache] Hit', key)
      return redis.get<T>(key)
    },

    set: async (value: T, ...args: A): Promise<void> => {
      const key = getKey(args)
      consola.info('[Cache] Set', key)
      await redis.set(key, value, { ex: ttl })
    }
  }
}
