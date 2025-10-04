import { votes } from '@repo/db'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const createVoteInputSchema = z.object({
  id: z.string(),
  like: z.boolean().nullable()
})

export const createVoteOutputSchema = createSelectSchema(votes)
