import * as z from 'zod'

export const InfiniteQuerySchema = z.object({
  cursor: z.date().optional(),
  limit: z.number().min(1).max(50).default(10),
})

export const EmptyOutputSchema = z.undefined()
