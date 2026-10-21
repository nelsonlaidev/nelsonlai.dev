import * as z from 'zod'

export const InfiniteQueryCursorSchema = z.object({
  createdAt: z.iso.datetime({ precision: 3 }),
  id: z.string(),
})

export const InfiniteQuerySchema = z.object({
  cursor: InfiniteQueryCursorSchema.optional(),
  limit: z.number().min(1).max(50).default(10),
})

export const EmptyOutputSchema = z.void()
