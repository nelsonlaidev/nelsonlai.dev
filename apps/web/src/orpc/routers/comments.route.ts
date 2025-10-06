import { ORPCError } from '@orpc/client'
import { createId } from '@paralleldrive/cuid2'
import { and, asc, comments, count, desc, eq, gt, isNotNull, isNull, lt, ne, votes } from '@repo/db'
import { getLocale } from 'next-intl/server'

import { getPostBySlug } from '@/lib/content'
import { sendCommentNotification } from '@/lib/discord'
import { getDefaultImage } from '@/utils/get-default-image'

import { protectedProcedure, publicProcedure } from '../root'
import {
  countCommentsInputSchema,
  countCommentsOutputSchema,
  createCommentInputSchema,
  createCommentOutputSchema,
  deleteCommentInputSchema,
  listCommentsInputSchema,
  listCommentsOutputSchema
} from '../schemas/comments.schema'
import { emptyOutputSchema } from '../schemas/common.schema'

export const listComments = publicProcedure
  .input(listCommentsInputSchema)
  .output(listCommentsOutputSchema)
  .handler(async ({ input, context }) => {
    const session = context.session

    const getCursorFilter = () => {
      if (!input.cursor) return
      return input.sort === 'newest' ? lt(comments.createdAt, input.cursor) : gt(comments.createdAt, input.cursor)
    }

    const query = await context.db.query.comments.findMany({
      where: and(
        eq(comments.postId, input.slug),
        input.parentId ? eq(comments.parentId, input.parentId) : isNull(comments.parentId),
        input.type === 'comments' ? isNull(comments.parentId) : isNotNull(comments.parentId),
        getCursorFilter(),
        input.highlightedCommentId ? ne(comments.id, input.highlightedCommentId) : undefined
      ),
      limit: input.limit,
      with: {
        user: {
          columns: {
            name: true,
            image: true,
            role: true,
            id: true
          }
        },
        votes: {
          where: eq(votes.userId, session?.user.id ?? '')
        }
      },
      orderBy: input.sort === 'newest' ? desc(comments.createdAt) : asc(comments.createdAt)
    })

    if (input.highlightedCommentId && !input.cursor) {
      const highlightedComment = await context.db.query.comments.findFirst({
        where: eq(comments.id, input.highlightedCommentId),
        with: {
          user: {
            columns: {
              name: true,
              image: true,
              role: true,
              id: true
            }
          },
          votes: {
            where: eq(votes.userId, session?.user.id ?? '')
          }
        }
      })

      if (highlightedComment) query.unshift(highlightedComment)
    }

    const result = query.map((comment) => {
      const selfVote = comment.votes.length > 0 ? comment.votes[0] : null
      const defaultImage = getDefaultImage(comment.user.id)

      return {
        ...comment,
        liked: selfVote?.like ?? null,
        user: {
          ...comment.user,
          image: comment.user.image ?? defaultImage,
          name: comment.user.name
        }
      }
    })

    return {
      comments: result,
      nextCursor: result.at(-1)?.createdAt
    }
  })

export const createComment = protectedProcedure
  .input(createCommentInputSchema)
  .output(createCommentOutputSchema)
  .handler(async ({ input, context }) => {
    const user = context.session.user

    const locale = await getLocale()
    const commentId = createId()

    const post = getPostBySlug(locale, input.slug)

    if (!post) throw new ORPCError('NOT_FOUND', { message: 'Blog post not found' })

    const comment = await context.db.transaction(async (tx) => {
      const [c] = await tx
        .insert(comments)
        .values({
          id: commentId,
          body: input.content,
          userId: user.id,
          postId: input.slug,
          parentId: input.parentId
        })
        .returning()

      if (!c) {
        throw new ORPCError('INTERNAL_SERVER_ERROR', {
          message: 'Failed to create comment'
        })
      }

      // Notify the author of the blog post via email
      if (!input.parentId && user.role === 'user') {
        await sendCommentNotification(
          post.title,
          post.slug,
          input.content,
          commentId,
          user.name,
          user.image ?? getDefaultImage(user.id)
        )
      }

      return c
    })

    return comment
  })

export const deleteComment = protectedProcedure
  .input(deleteCommentInputSchema)
  .output(emptyOutputSchema)
  .handler(async ({ input, context }) => {
    const email = context.session.user.email

    const comment = await context.db.query.comments.findFirst({
      where: eq(comments.id, input.id),
      with: {
        user: true,
        replies: true,
        parent: true
      }
    })

    if (!comment) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Comment not found'
      })
    }

    // Check if the user is the owner of the comment
    if (comment.user.email !== email) {
      throw new ORPCError('UNAUTHORIZED')
    }

    // If the comment has replies, just mark it as deleted.
    // And keep the replies.
    if (comment.replies.length > 0) {
      await context.db.update(comments).set({ isDeleted: true }).where(eq(comments.id, input.id))

      return
    }

    // Otherwise, delete the comment
    await context.db.delete(comments).where(eq(comments.id, input.id))

    // Case: deleting a reply
    if (comment.parentId) {
      const parentComment = await context.db.query.comments.findFirst({
        where: and(eq(comments.id, comment.parentId), eq(comments.isDeleted, true)),
        with: {
          replies: true
        }
      })

      // If the parent comment (which is marked as deleted) has no replies, delete it also.
      if (parentComment?.replies.length === 0) {
        await context.db.delete(comments).where(eq(comments.id, comment.parentId))
      }
    }
  })

export const countComments = publicProcedure
  .input(countCommentsInputSchema)
  .output(countCommentsOutputSchema)
  .handler(async ({ input, context }) => {
    const [result] = await context.db
      .select({
        value: count()
      })
      .from(comments)
      .where(and(eq(comments.postId, input.slug), input.withReplies ? undefined : isNull(comments.parentId)))

    return {
      count: result?.value ?? 0
    }
  })
