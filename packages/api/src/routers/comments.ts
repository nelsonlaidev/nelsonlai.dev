import { ORPCError } from '@orpc/server'
import { users } from '@repo/db/schema/auth'
import { comments, commentVotes } from '@repo/db/schema/comments'
import { posts } from '@repo/db/schema/posts'
import { and, eq, isNull, ne, sql } from 'drizzle-orm'
import * as z from 'zod'

import { notifyComment } from '../lib/comment-notifications'
import { createTimestampPagination } from '../pagination'
import { protectedProcedure, publicProcedure } from '../procedures'
import {
  CommentCountsSchema,
  CreateCommentInputSchema,
  DeleteCommentInputSchema,
  ListCommentsInputSchema,
  ListCommentsOutputSchema,
  VoteCommentInputSchema,
} from '../schema/comments'
import { PostSlugInputSchema } from '../schema/posts'

const list = publicProcedure
  .input(ListCommentsInputSchema)
  .output(ListCommentsOutputSchema)
  .handler(async ({ input, context }) => {
    const pagination = createTimestampPagination(comments, input)
    const scope = and(
      eq(comments.postSlug, input.slug),
      input.parentId ? eq(comments.parentId, input.parentId) : isNull(comments.parentId),
    )
    const selection = {
      id: comments.id,
      body: comments.body,
      postSlug: comments.postSlug,
      parentId: comments.parentId,
      userId: comments.userId,
      isDeleted: comments.isDeleted,
      createdAt: comments.createdAt,
      replyCount:
        sql<number>`(select count(*) from ${comments} as replies where replies.parent_id = ${comments.id})`.mapWith(
          Number,
        ),
      likeCount:
        sql<number>`(select count(*) from ${commentVotes} where ${commentVotes.commentId} = ${comments.id} and ${commentVotes.isLike} = true)`.mapWith(
          Number,
        ),
      dislikeCount:
        sql<number>`(select count(*) from ${commentVotes} where ${commentVotes.commentId} = ${comments.id} and ${commentVotes.isLike} = false)`.mapWith(
          Number,
        ),
      liked: sql<
        boolean | null
      >`(select ${commentVotes.isLike} from ${commentVotes} where ${commentVotes.commentId} = ${comments.id} and ${commentVotes.userId} = ${context.session?.user.id ?? ''})`,
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
        role: users.role,
      },
    }

    const rows = await context.db
      .select(selection)
      .from(comments)
      .leftJoin(users, eq(users.id, comments.userId))
      .where(
        and(
          scope,
          pagination.where,
          input.highlightedCommentId ? ne(comments.id, input.highlightedCommentId) : undefined,
        ),
      )
      .orderBy(...pagination.orderBy)
      .limit(pagination.limit)
    const page = pagination.getPage(rows)

    if (input.highlightedCommentId && !input.cursor) {
      const [highlighted] = await context.db
        .select(selection)
        .from(comments)
        .leftJoin(users, eq(users.id, comments.userId))
        .where(and(scope, eq(comments.id, input.highlightedCommentId)))
      if (highlighted) page.items.unshift(highlighted)
    }

    return {
      comments: page.items.map((comment) => ({
        ...comment,
        body: comment.isDeleted ? '' : comment.body,
      })),
      nextCursor: page.nextCursor,
    }
  })

const counts = publicProcedure
  .input(PostSlugInputSchema)
  .output(CommentCountsSchema)
  .handler(async ({ input, context }) => {
    const [result] = await context.db
      .select({
        comments: sql<number>`count(*) filter (where ${comments.parentId} is null)`.mapWith(Number),
        replies: sql<number>`count(*) filter (where ${comments.parentId} is not null)`.mapWith(Number),
      })
      .from(comments)
      .where(eq(comments.postSlug, input.slug))

    return result ?? { comments: 0, replies: 0 }
  })

const create = protectedProcedure
  .input(CreateCommentInputSchema)
  .output(z.object({ id: z.string() }))
  .handler(async ({ input, context }) => {
    const post = context.posts.find((post) => post.slug === input.slug && post.locale === input.locale)
    if (!post) throw new ORPCError('NOT_FOUND')
    const comment = await context.db.transaction(async (tx) => {
      const [post] = await tx.select({ slug: posts.slug }).from(posts).where(eq(posts.slug, input.slug))
      if (!post) throw new ORPCError('NOT_FOUND')
      if (input.parentId) {
        const [parent] = await tx.select().from(comments).where(eq(comments.id, input.parentId)).for('update')
        if (!parent || parent.postSlug !== input.slug || parent.parentId || parent.isDeleted)
          throw new ORPCError('BAD_REQUEST', { message: 'Invalid parent comment' })
      }
      const [created] = await tx
        .insert(comments)
        .values({ body: input.body, postSlug: input.slug, userId: context.session.user.id, parentId: input.parentId })
        .returning()
      if (!created) throw new ORPCError('INTERNAL_SERVER_ERROR')
      return created
    })

    await notifyComment(comment, context.session.user, post, context.db)
    return { id: comment.id }
  })

const remove = protectedProcedure
  .input(DeleteCommentInputSchema)
  .output(z.void())
  .handler(async ({ input, context }) => {
    await context.db.transaction(async (tx) => {
      // Lock the root before a reply so creation, deletion, and cleanup use the same order.
      const [target] = await tx.select({ parentId: comments.parentId }).from(comments).where(eq(comments.id, input.id))
      if (!target) throw new ORPCError('NOT_FOUND')
      const rootId = target.parentId ?? input.id
      const [root] = await tx.select().from(comments).where(eq(comments.id, rootId)).for('update')
      if (!root) throw new ORPCError('NOT_FOUND')
      const [comment] =
        rootId === input.id ? [root] : await tx.select().from(comments).where(eq(comments.id, input.id)).for('update')
      if (!comment) throw new ORPCError('NOT_FOUND')
      if (comment.userId !== context.session.user.id) throw new ORPCError('FORBIDDEN')

      const [reply] = await tx
        .select({ id: comments.id })
        .from(comments)
        .where(eq(comments.parentId, comment.id))
        .limit(1)
      if (reply) {
        await tx.update(comments).set({ body: '', isDeleted: true }).where(eq(comments.id, comment.id))
      } else {
        await tx.delete(comments).where(eq(comments.id, comment.id))
        if (comment.parentId && root.isDeleted) {
          const [remaining] = await tx
            .select({ id: comments.id })
            .from(comments)
            .where(eq(comments.parentId, root.id))
            .limit(1)
          if (!remaining) await tx.delete(comments).where(eq(comments.id, root.id))
        }
      }
    })
  })

const vote = protectedProcedure
  .input(VoteCommentInputSchema)
  .output(z.void())
  .handler(async ({ input, context }) => {
    await context.db.transaction(async (tx) => {
      const [comment] = await tx.select().from(comments).where(eq(comments.id, input.id)).for('update')
      if (!comment || comment.isDeleted) throw new ORPCError('NOT_FOUND')
      const userId = context.session.user.id
      if (input.isLike === null) {
        await tx.delete(commentVotes).where(and(eq(commentVotes.userId, userId), eq(commentVotes.commentId, input.id)))
        return
      }
      await tx
        .insert(commentVotes)
        .values({ userId, commentId: input.id, isLike: input.isLike })
        .onConflictDoUpdate({ target: [commentVotes.userId, commentVotes.commentId], set: { isLike: input.isLike } })
    })
  })

export const commentsRouter = {
  list,
  counts,
  create,
  delete: remove,
  vote,
}
