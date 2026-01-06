import { comments, users } from '@repo/db'

import { adminProcedure } from '@/orpc/orpc'

import { ListCommentsOutputSchema, ListUsersOutputSchema } from '../schemas/admin.schema'

export const listComments = adminProcedure.output(ListCommentsOutputSchema).handler(async ({ context }) => {
  const result = await context.db.select().from(comments)

  return {
    comments: result
  }
})

export const listUsers = adminProcedure.output(ListUsersOutputSchema).handler(async ({ context }) => {
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

export const adminRouter = {
  comment: {
    list: listComments
  },
  user: {
    list: listUsers
  }
}
