import { createId } from '@paralleldrive/cuid2'
import { relations, sql } from 'drizzle-orm'
import { boolean, foreignKey, index, integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'
import { posts } from './post.schema'
import { unsubscribes } from './unsubscribe.schema'

export const comments = pgTable(
  'comments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    body: text('body').notNull(),
    userId: text('user_id')
      .notNull()
      .default('ghost')
      .references(() => users.id, { onDelete: 'set default' }),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
    postId: text('post_id')
      .notNull()
      .references(() => posts.slug, { onDelete: 'cascade' }),
    parentId: text('parent_id'),
    isDeleted: boolean('is_deleted').notNull().default(false),
    replyCount: integer('reply_count').notNull().default(0),
    likeCount: integer('like_count').notNull().default(0),
    dislikeCount: integer('dislike_count').notNull().default(0),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
    }).onDelete('restrict'),
    index('comments_post_id_idx').on(table.postId),
    index('comments_parent_id_idx').on(table.parentId),
    index('comments_user_id_idx').on(table.userId),
    index('comments_post_id_created_at_desc_idx')
      .on(table.postId, table.createdAt.desc())
      .where(sql`${table.parentId} IS NULL`),
    index('comments_parent_id_created_at_desc_idx')
      .on(table.parentId, table.createdAt.desc())
      .where(sql`${table.parentId} IS NOT NULL`),
    index('comments_body_tsvector_idx').using('gin', sql`to_tsvector('english', ${table.body})`),
  ],
)

export const votes = pgTable(
  'votes',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    commentId: text('comment_id')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    isLike: boolean('is_like').notNull(),
  },
  (vote) => [
    primaryKey({ columns: [vote.userId, vote.commentId] }),
    index('votes_comment_id_is_like_idx').on(vote.commentId, vote.isLike),
  ],
)

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.slug],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'comment_replies',
  }),
  replies: many(comments, {
    relationName: 'comment_replies',
  }),
  votes: many(votes),
  unsubscribes: many(unsubscribes),
}))

export const votesRelations = relations(votes, ({ one }) => ({
  user: one(users, {
    fields: [votes.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [votes.commentId],
    references: [comments.id],
  }),
}))
