import * as z from 'zod'

export const CountRepliesInputSchema = z.object({
  slug: z.string().min(1)
})

export const CountRepliesOutputSchema = z.object({
  count: z.number()
})
