import { Buffer } from 'node:buffer'

import * as z from 'zod'

import { env } from '@/lib/env'
import { TraceableError } from '@/lib/errors'

import { publicProcedure } from '../procedures'
import { SpotifyStatsOutputSchema } from '../schemas/spotify.schema'

const AccessTokenResponseSchema = z.object({
  access_token: z.string(),
})

const NowPlayingResponseSchema = z.object({
  is_playing: z.boolean(),
  item: z
    .object({
      type: z.string(),
      name: z.string(),
      external_urls: z.object({
        spotify: z.string(),
      }),
      artists: z.array(
        z.object({
          name: z.string(),
        }),
      ),
    })
    .nullable(),
})

const CLIENT_ID = env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = env.SPOTIFY_REFRESH_TOKEN

const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

const EMPTY_RESPONSE = {
  isPlaying: false,
  songUrl: null,
  name: null,
  artist: null,
} as const

async function getAccessToken() {
  if (!REFRESH_TOKEN) return null

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${BASIC}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new TraceableError('Spotify token API error', {
      status: response.status,
      statusText: response.statusText,
      body,
    })
  }

  const rawData = await response.json()
  const data = AccessTokenResponseSchema.parse(rawData)

  return data.access_token
}

const spotifyStats = publicProcedure.output(SpotifyStatsOutputSchema).handler(async () => {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return EMPTY_RESPONSE
  }

  const accessToken = await getAccessToken()

  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (response.status === 204) {
    return EMPTY_RESPONSE
  }

  if (!response.ok) {
    const body = await response.text()
    throw new TraceableError('Spotify now playing API error', {
      status: response.status,
      statusText: response.statusText,
      body,
    })
  }

  const rawData = await response.json()
  const song = NowPlayingResponseSchema.parse(rawData)

  // If the song is not playing or is not a track, return an empty response
  if (song.item?.type !== 'track') {
    return EMPTY_RESPONSE
  }

  const artists = song.item.artists.map((artist) => artist.name).join(', ')

  return {
    isPlaying: song.is_playing,
    songUrl: song.item.external_urls.spotify,
    name: song.item.name,
    artist: artists,
  }
})

export const spotifyRouter = {
  stats: spotifyStats,
}
