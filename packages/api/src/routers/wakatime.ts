import * as z from 'zod'

import { cache } from '../cache'
import { ENV } from '../env'
import { publicProcedure } from '../procedures'
import { WakatimeStatsSchema } from '../schema/wakatime'

const WakatimeAllTimeResponseSchema = z.object({
  data: z.object({ total_seconds: z.number() }),
})

const getStats = publicProcedure.output(WakatimeStatsSchema).handler(async () => {
  if (!ENV.WAKATIME_API_KEY) {
    return { hours: 0 }
  }

  const cached = await cache.wakatime.stats.get('all-time')
  if (cached !== null) return cached

  const response = await fetch(
    `https://wakatime.com/api/v1/users/current/all_time_since_today?api_key=${ENV.WAKATIME_API_KEY}`,
    { signal: AbortSignal.timeout(10_000) },
  )

  if (!response.ok) {
    throw new Error(`WakaTime API error: ${response.status} ${response.statusText}`)
  }

  const rawData = await response.json()
  const { data } = WakatimeAllTimeResponseSchema.parse(rawData)

  const result = {
    hours: Math.round(data.total_seconds / 60 / 60),
  }

  await cache.wakatime.stats.set('all-time', result)

  return result
})

export const wakatimeRouter = {
  stats: getStats,
}
