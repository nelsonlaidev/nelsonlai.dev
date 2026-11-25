import * as z from 'zod'

export const SpotifyNowPlayingSchema = z.discriminatedUnion('isPlaying', [
  z.object({ isPlaying: z.literal(false) }),
  z.object({
    isPlaying: z.literal(true),
    songUrl: z.url(),
    title: z.string(),
    artist: z.string(),
  }),
])
