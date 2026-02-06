import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

import { votes } from '@/db/schemas'

export const CreateVoteInputSchema = z.object({
  id: z.string(),
  isLike: z.boolean().nullable(),
})

export const CreateVoteOutputSchema = createSelectSchema(votes)
