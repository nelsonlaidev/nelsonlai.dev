import { votes } from '@repo/db'
import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

export const createVoteInputSchema = z.object({
  id: z.string(),
  isLike: z.boolean().nullable()
})

export const createVoteOutputSchema = createSelectSchema(votes)
