import { Ratelimit } from '@upstash/ratelimit'

import { redis } from './redis'

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '10 s'),
  analytics: true,
})
