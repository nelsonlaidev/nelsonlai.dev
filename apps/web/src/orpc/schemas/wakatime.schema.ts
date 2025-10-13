import * as z from 'zod'

export const wakatimeStatsOutputSchema = z.object({
  hours: z.number()
})
