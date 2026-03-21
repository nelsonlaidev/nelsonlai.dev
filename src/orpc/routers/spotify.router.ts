import type * as z from 'zod'
import type { NotPlayingSchema } from '../schemas/spotify.schema'

import { Buffer } from 'node:buffer'

import { env } from '@/env'
import { TraceableError } from '@/lib/errors'

import { publicProcedure } from '../procedures'
import {
  AccessTokenResponseSchema,
  NowPlayingResponseSchema,
  SpotifyStatsOutputSchema,
} from '../schemas/spotify.schema'

const EMPTY_RESPONSE: z.infer<typeof NotPlayingSchema> = {
  isPlaying: false,
  songUrl: null,
  name: null,
  artist: null,
}

const CLIENT_ID = env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET
const REFRESH_TOKEN = env.SPOTIFY_REFRESH_TOKEN

const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing'
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token'

const getStats = publicProcedure.output(SpotifyStatsOutputSchema).handler(async () => {
  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    return EMPTY_RESPONSE
  }

  const tokenResponse = await fetch(TOKEN_ENDPOINT, {
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

  if (!tokenResponse.ok) {
    const body = await tokenResponse.text()
    throw new TraceableError('Spotify token API error', {
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      body,
    })
  }

  const { access_token } = AccessTokenResponseSchema.parse(await tokenResponse.json())

  const nowPlayingResponse = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })

  if (nowPlayingResponse.status === 204) {
    return EMPTY_RESPONSE
  }

  if (!nowPlayingResponse.ok) {
    const body = await nowPlayingResponse.text()
    throw new TraceableError('Spotify now playing API error', {
      status: nowPlayingResponse.status,
      statusText: nowPlayingResponse.statusText,
      body,
    })
  }

  const song = NowPlayingResponseSchema.parse(await nowPlayingResponse.json())

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
  stats: getStats,
}
