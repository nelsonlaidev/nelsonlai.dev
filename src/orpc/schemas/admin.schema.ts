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

export const StatsOutputSchema = z.object({
  totalUsers: z.number(),
  totalComments: z.number(),
  totalViews: z.number(),
  totalLikes: z.number(),
  totalMessages: z.number(),
})

const ActivityUserSchema = createSelectSchema(users).pick({
  id: true,
  name: true,
  image: true,
})

const CommentActivitySchema = z.object({
  type: z.literal('comment'),
  id: z.string(),
  body: z.string(),
  user: ActivityUserSchema,
  postId: z.string(),
  createdAt: z.date(),
})

const MessageActivitySchema = z.object({
  type: z.literal('message'),
  id: z.string(),
  body: z.string(),
  user: ActivityUserSchema,
  createdAt: z.date(),
})

export const RecentActivityOutputSchema = z.object({
  activities: z.array(z.discriminatedUnion('type', [CommentActivitySchema, MessageActivitySchema])),
})

export const TrendsInputSchema = z.object({
  days: z.number().int().min(1).max(365),
  timezone: z.string(),
})

export const TrendsOutputSchema = z.array(
  z.object({
    date: z.string(),
    comments: z.number(),
    messages: z.number(),
  }),
)
