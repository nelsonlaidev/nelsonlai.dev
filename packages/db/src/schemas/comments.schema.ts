import { relations, sql } from 'drizzle-orm'
import { boolean, index, integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'
import { posts } from './posts.schema'

export const comments = pgTable(
  'comment',
  {
    id: text('id').primaryKey(),
    body: text('body').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date()),
    postId: text('post_id')
      .notNull()
      .references(() => posts.slug),
    parentId: text('parent_id'),
    isDeleted: boolean('is_deleted').notNull().default(false),
    replyCount: integer('reply_count').notNull().default(0),
    likeCount: integer('like_count').notNull().default(0),
    dislikeCount: integer('dislike_count').notNull().default(0)
  },
  (table) => [
    index('idx_comment_post_id').on(table.postId),
    index('idx_comment_parent_id').on(table.parentId),
    index('idx_comment_user_id').on(table.userId),
    index('idx_comment_post_created')
      .on(table.postId, table.createdAt.desc())
      .where(sql`${table.parentId} IS NULL`),
    index('idx_comment_parent_created')
      .on(table.parentId, table.createdAt.desc())
      .where(sql`${table.parentId} IS NOT NULL`),
    index('idx_comment_body_search').using('gin', sql`to_tsvector('english', ${table.body})`)
  ]
)

export const votes = pgTable(
  'vote',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    commentId: text('comment_id')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    like: boolean('like').notNull()
  },
  (vote) => [
    primaryKey({ columns: [vote.userId, vote.commentId] }),
    index('idx_vote_comment_like').on(vote.commentId, vote.like),
    index('idx_vote_user_comment').on(vote.userId, vote.commentId)
  ]
)

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id]
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.slug]
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'comment_replies'
  }),
  replies: many(comments, {
    relationName: 'comment_replies'
  }),
  votes: many(votes)
}))

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id]
  }),
  comment: one(comments, {
    fields: [votes.commentId],
    references: [comments.id]
  })
}))
