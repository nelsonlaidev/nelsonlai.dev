import { createId } from '@paralleldrive/cuid2'
import { boolean, foreignKey, index, pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

import { users } from './auth'
import { createdAt, updatedAt } from './helpers'
import { posts } from './posts'

export const comments = pgTable(
  'comments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    body: text('body').notNull(),
    postId: text('post_id')
      .notNull()
      .references(() => posts.slug, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
    parentId: text('parent_id'),
    isDeleted: boolean('is_deleted').notNull().default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    foreignKey({ columns: [table.parentId], foreignColumns: [table.id] }).onDelete('restrict'),
    index('comments_post_created_id_idx').on(table.postId, table.createdAt, table.id),
    index('comments_parent_created_id_idx').on(table.parentId, table.createdAt, table.id),
    index('comments_user_idx').on(table.userId),
  ],
)

export const commentVotes = pgTable(
  'comment_votes',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    commentId: text('comment_id')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    isLike: boolean('is_like').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.commentId] }),
    index('comment_votes_comment_like_idx').on(table.commentId, table.isLike),
  ],
)

export const commentNotificationPreferences = pgTable('comment_notification_preferences', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  repliesEnabled: boolean('replies_enabled').notNull().default(true),
})

export const commentReplyUnsubscribes = pgTable(
  'comment_reply_unsubscribes',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    commentId: text('comment_id')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.userId, table.commentId] })],
)
