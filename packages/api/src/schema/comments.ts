import * as z from 'zod'

import { InfiniteQueryCursorSchema, InfiniteQueryInputSchema } from './pagination'
import { PostSlugInputSchema } from './posts'

export const CommentSchema = z.object({
  id: z.string(),
  body: z.string(),
  postId: z.string(),
  parentId: z.string().nullable(),
  userId: z.string().nullable(),
  isDeleted: z.boolean(),
  createdAt: z.date(),
  replyCount: z.number().int().nonnegative(),
  likeCount: z.number().int().nonnegative(),
  dislikeCount: z.number().int().nonnegative(),
  liked: z.boolean().nullable(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().nullable(),
    role: z.string().nullable(),
  }),
})

export const ListCommentsInputSchema = InfiniteQueryInputSchema.extend({
  ...PostSlugInputSchema.shape,
  parentId: z.string().min(1).max(100).optional(),
  sort: z.enum(['newest', 'oldest']).default('newest'),
  highlightedCommentId: z.string().min(1).max(100).optional(),
})

export const ListCommentsOutputSchema = z.object({
  comments: z.array(CommentSchema),
  nextCursor: InfiniteQueryCursorSchema.optional(),
})

export const CreateCommentInputSchema = PostSlugInputSchema.extend({
  body: z.string().trim().min(1).max(10_000),
  parentId: z.string().min(1).max(100).optional(),
  locale: z
    .string()
    .regex(/^[a-z]{2}(?:-[A-Z]{2})?$/)
    .default('en'),
})

export const DeleteCommentInputSchema = z.object({
  id: z.string().min(1).max(100),
})

export const VoteCommentInputSchema = DeleteCommentInputSchema.extend({
  isLike: z.boolean().nullable(),
})

export const CommentCountsSchema = z.object({
  comments: z.number().int().nonnegative(),
  replies: z.number().int().nonnegative(),
})

export const EmailNotificationPreferencesSchema = z.object({
  commentRepliesEnabled: z.boolean(),
})

export const UnsubscribeTokenInputSchema = z.object({
  token: z.string().min(1).max(4096),
})
