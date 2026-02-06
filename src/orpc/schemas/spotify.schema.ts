import * as z from 'zod'

const PlayingSchema = z.object({
  isPlaying: z.literal(true),
  songUrl: z.string(),
  name: z.string(),
  artist: z.string(),
})

const NotPlayingSchema = z.object({
  isPlaying: z.literal(false),
  songUrl: z.string().nullable(),
  name: z.string().nullable(),
  artist: z.string().nullable(),
})

export const SpotifyStatsOutputSchema = z.discriminatedUnion('isPlaying', [PlayingSchema, NotPlayingSchema])
