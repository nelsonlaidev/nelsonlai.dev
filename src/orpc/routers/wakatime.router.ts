import * as z from 'zod'

import { ENV } from '@/env'

import { publicProcedure } from '../procedures'
import { WakatimeStatsOutputSchema } from '../schemas/wakatime.schema'

const WakatimeResponseSchema = z.object({
  data: z.object({
    total_seconds: z.number(),
  }),
})

const getStats = publicProcedure.output(WakatimeStatsOutputSchema).handler(async () => {
  if (!ENV.WAKATIME_API_KEY) {
    return {
      hours: 0,
    }
  }

  const response = await fetch(
    `https://wakatime.com/api/v1/users/current/all_time_since_today?api_key=${ENV.WAKATIME_API_KEY}`,
  )

  if (!response.ok) {
    throw new Error(`WakaTime API error: ${response.status} ${response.statusText}`)
  }

  const rawData = await response.json()
  const { data } = WakatimeResponseSchema.parse(rawData)

  return {
    hours: Math.round(data.total_seconds / 60 / 60),
  }
})

export const wakatimeRouter = {
  stats: getStats,
}
