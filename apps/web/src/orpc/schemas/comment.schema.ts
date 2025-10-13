import { comments, users, votes } from '@repo/db'
import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

import { infiniteQuerySchema } from './common.schema'

export const listCommentsInputSchema = infiniteQuerySchema.extend({
  slug: z.string().min(1),
  parentId: z.string().optional(),
  sort: z.enum(['newest', 'oldest']).default('newest'),
  type: z.enum(['comments', 'replies']).default('comments'),
  highlightedCommentId: z.string().optional()
})

export const listCommentsOutputSchema = z.object({
  comments: z.array(
    createSelectSchema(comments).extend({
      liked: z.boolean().nullable(),
      user: createSelectSchema(users).pick({
        id: true,
        name: true,
        image: true,
        role: true
      }),
      votes: z.array(createSelectSchema(votes))
    })
  ),
  nextCursor: z.date().optional()
})

export const createCommentInputSchema = z.object({
  slug: z.string().min(1),
  content: z.string().min(1),
  date: z.string().min(1),
  parentId: z.string().optional()
})

export const createCommentOutputSchema = createSelectSchema(comments)

export const countCommentsInputSchema = z.object({
  slug: z.string().min(1),
  withReplies: z.boolean().optional().default(false)
})

export const deleteCommentInputSchema = z.object({
  id: z.string().min(1)
})

export const countCommentsOutputSchema = z.object({
  count: z.number()
})
