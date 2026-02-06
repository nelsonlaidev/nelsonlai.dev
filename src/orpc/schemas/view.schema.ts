import * as z from 'zod'

export const CountViewOutputSchema = z.object({
  views: z.number(),
})

export { CountViewOutputSchema as IncrementViewOutputSchema }

export const CountViewInputSchema = z.object({
  slug: z.string(),
})

export const IncrementViewInputSchema = z.object({
  slug: z.string(),
})
