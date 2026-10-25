import * as z from 'zod'

export const GetStatsOutputSchema = z.object({
  hours: z.number(),
})
