import * as z from 'zod'

export const CountLikeInputSchema = z.object({
  slug: z.string(),
})

export const CountLikeOutputSchema = z.object({
  likes: z.number(),
  currentUserLikes: z.number(),
})

export const IncrementLikeInputSchema = z.object({
  slug: z.string().min(1),
  value: z.number().int().positive().min(1).max(3),
})

export { CountLikeOutputSchema as IncrementLikeOutputSchema }
