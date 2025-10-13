import * as z from 'zod'

export const countRepliesInputSchema = z.object({
  slug: z.string().min(1)
})

export const countRepliesOutputSchema = z.object({
  count: z.number()
})
