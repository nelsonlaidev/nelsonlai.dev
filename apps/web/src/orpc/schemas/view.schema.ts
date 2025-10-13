import * as z from 'zod'

export const countViewOutputSchema = z.object({
  views: z.number()
})

export { countViewOutputSchema as incrementViewOutputSchema }

export const countViewInputSchema = z.object({
  slug: z.string()
})

export const incrementViewInputSchema = z.object({
  slug: z.string()
})
