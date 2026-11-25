import { Redis } from '@upstash/redis'

import { ENV } from './env'

export const redis = new Redis({
  url: ENV.UPSTASH_REDIS_REST_URL,
  token: ENV.UPSTASH_REDIS_REST_TOKEN,
  retry: false,
  signal: () => AbortSignal.timeout(1000),
})
