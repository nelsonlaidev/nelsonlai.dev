import { comments, users } from '@repo/db'
import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

export const listAllCommentsOutputSchema = z.object({
  comments: z.array(createSelectSchema(comments))
})

export const listAllUsersOutputSchema = z.object({
  users: z.array(
    createSelectSchema(users).pick({
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    })
  )
})
