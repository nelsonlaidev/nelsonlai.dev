import * as z from 'zod'

export const InfiniteQueryCursorSchema = z.object({
  createdAt: z.iso.datetime({ precision: 3 }),
  id: z.string().min(1),
})

export const InfiniteQueryInputSchema = z.object({
  cursor: InfiniteQueryCursorSchema.optional(),
  limit: z.number().int().min(1).max(50).default(10),
})
