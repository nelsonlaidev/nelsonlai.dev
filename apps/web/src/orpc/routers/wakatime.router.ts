import { Buffer } from 'node:buffer'

import { env } from '@/lib/env'

import { publicProcedure } from '../procedures'
import { WakatimeStatsOutputSchema } from '../schemas/wakatime.schema'

const wakatimeStats = publicProcedure.output(WakatimeStatsOutputSchema).handler(async () => {
  if (!env.WAKATIME_API_KEY) {
    return {
      hours: 0
    }
  }

  const response = await fetch('https://wakatime.com/api/v1/users/current/all_time_since_today', {
    headers: {
      Authorization: `Basic ${Buffer.from(env.WAKATIME_API_KEY).toString('base64')}`
    }
  })

  const {
    data: { total_seconds }
  } = await response.json()

  return {
    hours: Math.round(total_seconds / 60 / 60)
  }
})

export const wakatimeRouter = {
  stats: wakatimeStats
}
