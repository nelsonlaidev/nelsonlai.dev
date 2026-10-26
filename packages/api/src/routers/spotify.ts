import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'

import * as z from 'zod'

import { cache } from '../cache'
import { ENV } from '../env'
import { publicProcedure } from '../procedures'
import { SpotifyNowPlayingSchema } from '../schema/spotify'

const SpotifyAccessTokenResponseSchema = z.object({
  access_token: z.string().min(1),
  expires_in: z.number().int().positive(),
})

const SpotifyPlaybackResponseSchema = z.object({
  is_playing: z.boolean(),
  item: z.object({ type: z.string() }).loose().nullable(),
})

const SpotifyTrackSchema = z.object({
  name: z.string(),
  external_urls: z.object({ spotify: z.url() }),
  artists: z.array(z.object({ name: z.string() })).min(1),
})

const getNowPlaying = publicProcedure.output(SpotifyNowPlayingSchema).handler(async () => {
  const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret, SPOTIFY_REFRESH_TOKEN: refreshToken } = ENV

  if (!clientId || !clientSecret || !refreshToken) return { isPlaying: false }

  const cacheKey = createHash('sha256').update(`${clientId}:${refreshToken}`).digest('hex')
  let accessToken = await cache.spotify.accessToken.get(cacheKey)

  if (accessToken === null) {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!tokenResponse.ok) {
      throw new Error(`Spotify token API error: ${tokenResponse.status} ${tokenResponse.statusText}`)
    }

    const token = SpotifyAccessTokenResponseSchema.parse(await tokenResponse.json())
    accessToken = token.access_token
    await cache.spotify.accessToken.set(cacheKey, accessToken, Math.max(1, token.expires_in - 30))
  }

  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(10_000),
  })

  if (response.status === 204) return { isPlaying: false }

  if (!response.ok) {
    if (response.status === 401) await cache.spotify.accessToken.del(cacheKey)
    throw new Error(`Spotify now playing API error: ${response.status} ${response.statusText}`)
  }

  const playback = SpotifyPlaybackResponseSchema.parse(await response.json())
  if (!playback.is_playing || playback.item?.type !== 'track') return { isPlaying: false }

  const track = SpotifyTrackSchema.parse(playback.item)

  return {
    isPlaying: true,
    songUrl: track.external_urls.spotify,
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
  }
})

export const spotifyRouter = {
  nowPlaying: getNowPlaying,
}
