import * as z from 'zod'

import { env } from '@/env'

import { publicProcedure } from '../procedures'
import { YoutubeStatsOutputSchema } from '../schemas/youtube.schema'

const YouTubeChannelListResponseSchema = z.object({
  items: z.array(
    z.object({
      statistics: z.object({
        subscriberCount: z.string(),
        viewCount: z.string(),
      }),
    }),
  ),
})

const EMPTY_RESPONSE = {
  subscribers: 0,
  views: 0,
}

const getStats = publicProcedure.output(YoutubeStatsOutputSchema).handler(async () => {
  if (!env.GOOGLE_API_KEY) return EMPTY_RESPONSE

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?id=UC2hMWOaOlk9vrkvFVaGmn0Q&part=statistics&key=${env.GOOGLE_API_KEY}`,
  )

  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status} ${response.statusText}`)
  }

  const rawData = await response.json()

  const data = YouTubeChannelListResponseSchema.parse(rawData)

  const channel = data.items[0]

  if (!channel) {
    throw new Error('YouTube channel not found')
  }

  const { statistics } = channel

  return {
    subscribers: Number(statistics.subscriberCount),
    views: Number(statistics.viewCount),
  }
})

export const youtubeRouter = {
  stats: getStats,
}
