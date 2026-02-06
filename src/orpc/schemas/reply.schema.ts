import * as z from 'zod'

export const CountReplyInputSchema = z.object({
  slug: z.string().min(1),
})

export const CountReplyOutputSchema = z.object({
  count: z.number(),
})
