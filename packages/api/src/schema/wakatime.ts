import * as z from 'zod'

export const WakatimeStatsSchema = z.object({
  hours: z.number(),
})
