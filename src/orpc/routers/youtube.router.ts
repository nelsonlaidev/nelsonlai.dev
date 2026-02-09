import { env } from '@/lib/env'

import { publicProcedure } from '@/orpc/procedures'
import { YoutubeStatsOutputSchema } from '@/orpc/schemas/youtube.schema'

const youtubeStats = publicProcedure.output(YoutubeStatsOutputSchema).handler(async () => {
  if (!env.GOOGLE_API_KEY) {
    return {
      subscribers: 0,
      views: 0,
    }
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?id=UC2hMWOaOlk9vrkvFVaGmn0Q&part=statistics&key=${env.GOOGLE_API_KEY}`,
  )
  const data = await response.json()

  const channel = data.items[0]
  const { statistics } = channel

  return {
    subscribers: Number(statistics.subscriberCount),
    views: Number(statistics.viewCount),
  }
})

export const youtubeRouter = {
  stats: youtubeStats,
}
