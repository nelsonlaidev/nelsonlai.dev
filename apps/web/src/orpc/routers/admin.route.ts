import { comments, users } from '@repo/db'

import { adminProcedure } from '@/orpc/root'

import { listAllCommentsOutputSchema, listAllUsersOutputSchema } from '../schemas/admin.schema'

export const listAllComments = adminProcedure.output(listAllCommentsOutputSchema).handler(async ({ context }) => {
  const result = await context.db.select().from(comments)

  return {
    comments: result
  }
})

export const listAllUsers = adminProcedure.output(listAllUsersOutputSchema).handler(async ({ context }) => {
  const result = await context.db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt
    })
    .from(users)

  return {
    users: result
  }
})
