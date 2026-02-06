import * as z from 'zod'

export const UnsubscribeTokenInputSchema = z.object({
  token: z.string().min(1),
})
