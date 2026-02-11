import { ORPCError } from '@orpc/client'
import { and, asc, count, desc, eq, gt, isNotNull, isNull, lt, ne } from 'drizzle-orm'
import { getLocale } from 'next-intl/server'

import { comments, settings, unsubscribes, votes } from '@/db/schemas'
import { CommentEmailTemplate, ReplyEmailTemplate } from '@/emails'
import { IS_PRODUCTION } from '@/lib/constants'
import { getPostBySlug } from '@/lib/content'
import { env } from '@/lib/env'
import { sendEmail } from '@/lib/resend'
import { generateCommentReplyUnsubToken } from '@/lib/unsubscribe'
import { getDefaultImage } from '@/utils/get-default-image'

import { protectedProcedure, publicProcedure } from '../procedures'
import {
  CountCommentInputSchema,
  CountCommentOutputSchema,
  CreateCommentInputSchema,
  CreateCommentOutputSchema,
  DeleteCommentInputSchema,
  ListCommentsInputSchema,
  ListCommentsOutputSchema,
} from '../schemas/comment.schema'
import { EmptyOutputSchema } from '../schemas/common.schema'

const listComments = publicProcedure
  .input(ListCommentsInputSchema)
  .output(ListCommentsOutputSchema)
  .handler(async ({ input, context }) => {
    const { session } = context

    function getCursorFilter() {
      if (!input.cursor) return
      return input.sort === 'newest' ? lt(comments.createdAt, input.cursor) : gt(comments.createdAt, input.cursor)
    }

    const query = await context.db.query.comments.findMany({
      where: and(
        eq(comments.postId, input.slug),
        input.parentId ? eq(comments.parentId, input.parentId) : isNull(comments.parentId),
        input.type === 'comments' ? isNull(comments.parentId) : isNotNull(comments.parentId),
        getCursorFilter(),
        input.highlightedCommentId ? ne(comments.id, input.highlightedCommentId) : undefined,
      ),
      limit: input.limit,
      with: {
        user: {
          columns: {
            name: true,
            image: true,
            role: true,
            id: true,
          },
        },
        votes: {
          where: eq(votes.userId, session?.user.id ?? ''),
        },
      },
      orderBy: input.sort === 'newest' ? desc(comments.createdAt) : asc(comments.createdAt),
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
              id: true,
            },
          },
          votes: {
            where: eq(votes.userId, session?.user.id ?? ''),
          },
        },
      })

      if (highlightedComment) query.unshift(highlightedComment)
    }

    const result = query.map((comment) => {
      const selfVote = comment.votes.length > 0 ? comment.votes[0] : null
      const defaultImage = getDefaultImage(comment.user.id)

      return {
        ...comment,
        liked: selfVote?.isLike ?? null,
        user: {
          ...comment.user,
          image: comment.user.image ?? defaultImage,
          name: comment.user.name,
        },
      }
    })

    return {
      comments: result,
      nextCursor: result.at(-1)?.createdAt,
    }
  })

const createComment = protectedProcedure
  .input(CreateCommentInputSchema)
  .output(CreateCommentOutputSchema)
  .handler(async ({ input, context }) => {
    const { user } = context.session

    const locale = await getLocale()

    const post = getPostBySlug(locale, input.slug)

    if (!post) throw new ORPCError('NOT_FOUND', { message: 'Blog post not found' })

    const commenterName = user.name
    const commenterImage = user.image ?? getDefaultImage(user.id)
    const postTitle = post.title
    const postUrl = `https://nelsonlai.dev/blog/${input.slug}`

    const comment = await context.db.transaction(async (tx) => {
      const [c] = await tx
        .insert(comments)
        .values({
          body: input.content,
          userId: user.id,
          postId: input.slug,
          parentId: input.parentId,
        })
        .returning()

      if (!c) {
        throw new ORPCError('INTERNAL_SERVER_ERROR', {
          message: 'Failed to create comment',
        })
      }

      // Notify the author of the blog post via email
      if (IS_PRODUCTION && !input.parentId && user.role === 'user') {
        if (env.AUTHOR_EMAIL) {
          await sendEmail({
            to: env.AUTHOR_EMAIL,
            subject: 'New comment on your blog post',
            react: CommentEmailTemplate({
              comment: input.content,
              commenterName,
              commenterImage,
              commentIdentifier: `comment=${c.id}`,
              date: input.date,
              postTitle,
              postUrl,
            }),
          })
        } else {
          console.warn('AUTHOR_EMAIL is not set. Skipping email sending.')
        }
      }

      // Notify the parent comment owner via email
      if (IS_PRODUCTION && input.parentId) {
        const parentComment = await tx.query.comments.findFirst({
          where: eq(comments.id, input.parentId),
          with: {
            user: true,
          },
        })

        // Don't notify if the reply is to own comment or the parent comment user is "ghost"
        if (parentComment && parentComment.userId !== user.id && parentComment.user.id !== 'ghost') {
          const [userSettings] = await tx
            .select({ replyNotificationsEnabled: settings.replyNotificationsEnabled })
            .from(settings)
            .where(eq(settings.userId, parentComment.userId))

          const unsubscribedFromThisComment = await tx.query.unsubscribes.findFirst({
            where: and(
              eq(unsubscribes.commentId, input.parentId),
              eq(unsubscribes.userId, parentComment.userId),
              eq(unsubscribes.type, 'comment_reply'),
            ),
          })

          // Don't send notification email if the user
          // has disabled reply notifications or unsubscribed from this specific comment's replies
          if (userSettings?.replyNotificationsEnabled === false || unsubscribedFromThisComment) return c

          const token = await generateCommentReplyUnsubToken(parentComment.userId, input.parentId)

          await sendEmail({
            to: parentComment.user.email,
            subject: `New reply to your comment on "${post.title}"`,
            react: ReplyEmailTemplate({
              reply: input.content,
              replierName: commenterName,
              replierImage: commenterImage,
              comment: parentComment.body,
              replierIdentifier: `comment=${input.parentId}&reply=${c.id}`,
              date: input.date,
              postTitle,
              postUrl,
              unsubscribeUrl: `https://nelsonlai.dev/unsubscribe?token=${token}`,
            }),
          })
        }
      }

      return c
    })

    return comment
  })

const deleteComment = protectedProcedure
  .input(DeleteCommentInputSchema)
  .output(EmptyOutputSchema)
  .handler(async ({ input, context }) => {
    const userId = context.session.user.id

    const comment = await context.db.query.comments.findFirst({
      where: eq(comments.id, input.id),
      with: {
        user: true,
        replies: true,
        parent: true,
      },
    })

    if (!comment) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Comment not found',
      })
    }

    // Check if the user is the owner of the comment
    if (comment.userId !== userId) {
      throw new ORPCError('UNAUTHORIZED')
    }

    // If the comment has replies, just mark it as deleted.
    // And keep the replies.
    if (comment.replies.length > 0) {
      await context.db.update(comments).set({ isDeleted: true }).where(eq(comments.id, input.id))

      return
    }

    // Otherwise, delete the comment
    await context.db.transaction(async (tx) => {
      await tx.delete(comments).where(eq(comments.id, input.id))

      // Case: deleting a reply
      if (comment.parentId) {
        const parentComment = await tx.query.comments.findFirst({
          where: and(eq(comments.id, comment.parentId), eq(comments.isDeleted, true)),
        })

        if (parentComment) {
          // Check if parent has any remaining replies
          const remainingReplies = await tx.select().from(comments).where(eq(comments.parentId, comment.parentId))

          // If the parent comment (which is marked as deleted) has no replies, delete it also.
          if (remainingReplies.length === 0) {
            await tx.delete(comments).where(eq(comments.id, comment.parentId))
          }
        }
      }
    })
  })

const countComment = publicProcedure
  .input(CountCommentInputSchema)
  .output(CountCommentOutputSchema)
  .handler(async ({ input, context }) => {
    const [result] = await context.db
      .select({
        value: count(),
      })
      .from(comments)
      .where(and(eq(comments.postId, input.slug), input.withReplies ? undefined : isNull(comments.parentId)))

    return {
      count: result?.value ?? 0,
    }
  })

export const commentRouter = {
  list: listComments,
  create: createComment,
  delete: deleteComment,
  count: countComment,
}
