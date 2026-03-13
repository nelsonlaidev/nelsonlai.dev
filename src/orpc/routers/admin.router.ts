import { ORPCError } from '@orpc/client'
import { count, desc } from 'drizzle-orm'

import { comments, users } from '@/db/schemas'

import { adminProcedure } from '../procedures'
import { ListCommentsInputSchema, ListCommentsOutputSchema, ListUsersOutputSchema } from '../schemas/admin.schema'

const listComments = adminProcedure
  .input(ListCommentsInputSchema)
  .output(ListCommentsOutputSchema)
  .handler(async ({ input, context }) => {
    const [result, [totalCountResult]] = await Promise.all([
      context.db.query.comments.findMany({
        with: {
          user: {
            columns: {
              name: true,
              image: true,
            },
          },
        },
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
        orderBy: desc(comments.createdAt),
      }),
      context.db.select({ count: count() }).from(comments),
    ])

    if (!totalCountResult) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to fetch total count of comments',
      })
    }

    return {
      comments: result,
      pageCount: Math.ceil(totalCountResult.count / input.limit),
      totalCount: totalCountResult.count,
    }
  })

const listUsers = adminProcedure.output(ListUsersOutputSchema).handler(async ({ context }) => {
  const result = await context.db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)

  return {
    users: result,
  }
})

export const adminRouter = {
  comment: {
    list: listComments,
  },
  user: {
    list: listUsers,
  },
}
