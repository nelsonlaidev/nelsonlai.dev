import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

import { comments, users } from '@/db/schemas'

export const ListCommentsOutputSchema = z.object({
  comments: z.array(createSelectSchema(comments)),
})

export const ListUsersOutputSchema = z.object({
  users: z.array(
    createSelectSchema(users).pick({
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }),
  ),
})
