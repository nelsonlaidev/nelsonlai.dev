import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

import { messages, users } from '@/db/schemas'

export const CreateMessageOutputSchema = createSelectSchema(messages).pick({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  body: true,
})

export const CreateMessageInputSchema = z.object({
  message: z.string().min(1),
})

export const ListMessagesOutputSchema = z.object({
  messages: z.array(
    CreateMessageOutputSchema.extend({
      user: createSelectSchema(users).pick({
        name: true,
        image: true,
        id: true,
      }),
    }),
  ),
  nextCursor: z.date().optional(),
})

export const DeleteMessageInputSchema = z.object({
  id: z.string(),
})

export { InfiniteQuerySchema as ListMessagesInputSchema } from './common.schema'
