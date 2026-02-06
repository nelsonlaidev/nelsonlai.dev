import * as z from 'zod'

export const WakatimeStatsOutputSchema = z.object({
  hours: z.number(),
})
