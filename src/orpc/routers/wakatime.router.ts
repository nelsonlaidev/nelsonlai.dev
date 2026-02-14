import { Buffer } from 'node:buffer'

import * as z from 'zod'

import { env } from '@/lib/env'
import { TraceableError } from '@/lib/errors'

import { publicProcedure } from '../procedures'
import { WakatimeStatsOutputSchema } from '../schemas/wakatime.schema'

const WakatimeResponseSchema = z.object({
  data: z.object({
    total_seconds: z.number(),
  }),
})

const wakatimeStats = publicProcedure.output(WakatimeStatsOutputSchema).handler(async () => {
  if (!env.WAKATIME_API_KEY) {
    return {
      hours: 0,
    }
  }

  const response = await fetch('https://wakatime.com/api/v1/users/current/all_time_since_today', {
    headers: {
      Authorization: `Basic ${Buffer.from(env.WAKATIME_API_KEY).toString('base64')}`,
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new TraceableError('WakaTime API error', {
      status: response.status,
      statusText: response.statusText,
      body,
    })
  }

  const rawData = await response.json()
  const { data } = WakatimeResponseSchema.parse(rawData)

  return {
    hours: Math.round(data.total_seconds / 60 / 60),
  }
})

export const wakatimeRouter = {
  stats: wakatimeStats,
}
