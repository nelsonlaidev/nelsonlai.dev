import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

import { DEFAULT_PAGE_SIZE } from '@/constants/common'
import { comments, users } from '@/db/schemas'

export const ListCommentsInputSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(DEFAULT_PAGE_SIZE),
})

export const ListCommentsOutputSchema = z.object({
  comments: z.array(
    createSelectSchema(comments).extend({
      user: createSelectSchema(users).pick({
        name: true,
        image: true,
      }),
    }),
  ),
  pageCount: z.number(),
  totalCount: z.number(),
})

export const ListUsersInputSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(DEFAULT_PAGE_SIZE),
})

export const ListUsersOutputSchema = z.object({
  users: z.array(
    createSelectSchema(users).pick({
      id: true,
      name: true,
      image: true,
      email: true,
      role: true,
      createdAt: true,
    }),
  ),
  pageCount: z.number(),
  totalCount: z.number(),
})
