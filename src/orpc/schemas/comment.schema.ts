import { createSelectSchema } from 'drizzle-zod'
import * as z from 'zod'

import { comments, users, votes } from '@/db/schemas'

import { InfiniteQuerySchema } from './common.schema'

export const ListCommentsInputSchema = InfiniteQuerySchema.extend({
  slug: z.string().min(1),
  parentId: z.string().optional(),
  sort: z.enum(['newest', 'oldest']).default('newest'),
  type: z.enum(['comments', 'replies']).default('comments'),
  highlightedCommentId: z.string().optional(),
})

export const ListCommentsOutputSchema = z.object({
  comments: z.array(
    createSelectSchema(comments).extend({
      liked: z.boolean().nullable(),
      user: createSelectSchema(users).pick({
        id: true,
        name: true,
        image: true,
        role: true,
      }),
      votes: z.array(createSelectSchema(votes)),
    }),
  ),
  nextCursor: z.date().optional(),
})

export const CreateCommentInputSchema = z.object({
  slug: z.string().min(1),
  content: z.string().min(1),
  date: z.string().min(1),
  parentId: z.string().optional(),
})

export const CreateCommentOutputSchema = createSelectSchema(comments)

export const CountCommentInputSchema = z.object({
  slug: z.string().min(1),
  withReplies: z.boolean().optional().default(false),
})

export const DeleteCommentInputSchema = z.object({
  id: z.string().min(1),
})

export const CountCommentOutputSchema = z.object({
  count: z.number(),
})
