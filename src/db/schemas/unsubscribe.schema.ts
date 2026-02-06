import { relations, sql } from 'drizzle-orm'
import { check, index, pgEnum, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'
import { comments } from './comment.schema'

export const unsubscribeTypeEnum = pgEnum('unsubscribe_type', ['comment_reply'])

export const unsubscribes = pgTable(
  'unsubscribes',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: unsubscribeTypeEnum('type').notNull(),
    commentId: text('comment_id').references(() => comments.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('unsubscribes_user_id_idx').on(table.userId),
    index('unsubscribes_comment_id_idx').on(table.commentId),
    unique('unsubscribes_user_id_type_comment_id_uq').on(table.userId, table.type, table.commentId),
    check(
      'unsubscribes_comment_reply_check',
      sql`(${table.type} = 'comment_reply' AND ${table.commentId} IS NOT NULL)`,
    ),
  ],
)

export const unsubscribesRelations = relations(unsubscribes, ({ one }) => ({
  user: one(users, {
    fields: [unsubscribes.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [unsubscribes.commentId],
    references: [comments.id],
  }),
}))
