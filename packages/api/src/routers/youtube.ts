import * as z from 'zod'

import { cache } from '../cache'
import { ENV } from '../env'
import { publicProcedure } from '../procedures'
import { YoutubeStatsSchema } from '../schema/youtube'

// cspell:disable-next-line
const CHANNEL_ID = 'UC2hMWOaOlk9vrkvFVaGmn0Q'

const YoutubeChannelListResponseSchema = z.object({
  items: z.array(
    z.object({
      statistics: z.object({
        subscriberCount: z.string().regex(/^\d+$/).transform(Number),
        viewCount: z.string().regex(/^\d+$/).transform(Number),
      }),
    }),
  ),
})

const getStats = publicProcedure.output(YoutubeStatsSchema).handler(async () => {
  if (!ENV.GOOGLE_API_KEY) {
    throw new Error('YouTube is not configured')
  }

  const cached = await cache.youtube.stats.get(CHANNEL_ID)
  if (cached !== null) return cached

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?id=${CHANNEL_ID}&part=statistics&key=${ENV.GOOGLE_API_KEY}`,
    { signal: AbortSignal.timeout(10_000) },
  )

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status} ${response.statusText}`)
  }

  const { items } = YoutubeChannelListResponseSchema.parse(await response.json())
  const channel = items[0]

  if (!channel) throw new Error('YouTube channel not found')

  const result = {
    subscribers: channel.statistics.subscriberCount,
    views: channel.statistics.viewCount,
  }

  await cache.youtube.stats.set(CHANNEL_ID, result)

  return result
})

export const youtubeRouter = {
  stats: getStats,
}
