import { relations, sql } from 'drizzle-orm'
import { check, index, pgEnum, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'
import { comments } from './comment.schema'

export const unsubscribeScopeEnum = pgEnum('unsubscribe_scope', ['comment_replies_user', 'comment_replies_comment'])

export const unsubscribes = pgTable(
  'unsubscribes',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    commentId: text('comment_id').references(() => comments.id, { onDelete: 'cascade' }),
    scope: unsubscribeScopeEnum('scope').notNull(),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
  },
  (table) => [
    index('unsubscribes_user_id_idx').on(table.userId),
    index('unsubscribes_comment_id_idx').on(table.commentId),
    unique('unsubscribes_user_id_scope_comment_id_uq').on(table.userId, table.scope, table.commentId),
    check(
      'unsubscribes_scope_comment_id_check',
      sql`(
        (${table.scope} = 'comment_replies_user' AND ${table.commentId} IS NULL)
        OR
        (${table.scope} = 'comment_replies_comment' AND ${table.commentId} IS NOT NULL)
      )`
    )
  ]
)

export const unsubscribesRelations = relations(unsubscribes, ({ one }) => ({
  user: one(users, {
    fields: [unsubscribes.userId],
    references: [users.id]
  }),
  comment: one(comments, {
    fields: [unsubscribes.commentId],
    references: [comments.id]
  })
}))
