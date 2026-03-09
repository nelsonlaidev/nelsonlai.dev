import * as z from 'zod'

export const AccessTokenResponseSchema = z.object({
  access_token: z.string(),
})

export const NowPlayingResponseSchema = z.object({
  is_playing: z.boolean(),
  item: z
    .object({
      type: z.string(),
      name: z.string(),
      external_urls: z.object({ spotify: z.string() }),
      artists: z.array(z.object({ name: z.string() })),
    })
    .nullable(),
})

const PlayingSchema = z.object({
  isPlaying: z.literal(true),
  songUrl: z.string(),
  name: z.string(),
  artist: z.string(),
})

export const NotPlayingSchema = z.object({
  isPlaying: z.literal(false),
  songUrl: z.string().nullable(),
  name: z.string().nullable(),
  artist: z.string().nullable(),
})

export const SpotifyStatsOutputSchema = z.discriminatedUnion('isPlaying', [PlayingSchema, NotPlayingSchema])
