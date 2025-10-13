import { messages, users } from '@repo/db'
import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

export const createMessageOutputSchema = createSelectSchema(messages).pick({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  body: true
})

export const createMessageInputSchema = z.object({
  message: z.string().min(1)
})

export const listMessagesOutputSchema = z.object({
  messages: z.array(
    createMessageOutputSchema.extend({
      user: createSelectSchema(users).pick({
        name: true,
        image: true,
        id: true
      })
    })
  ),
  nextCursor: z.date().optional()
})

export const deleteMessageInputSchema = z.object({
  id: z.string()
})

export { infiniteQuerySchema as listMessagesInputSchema } from './common.schema'
