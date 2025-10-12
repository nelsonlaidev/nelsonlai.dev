import { index, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'
import { comments } from './comment.schema'

export const unsubscribeTypeEnum = pgEnum('unsubscribe_type', ['all', 'comment'])

export const unsubscribes = pgTable(
  'unsubscribe',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    commentId: text('comment_id').references(() => comments.id, { onDelete: 'cascade' }),
    type: unsubscribeTypeEnum('type').notNull(),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
  },
  (table) => [
    index('idx_unsubscribe_user_id').on(table.userId),
    index('idx_unsubscribe_comment_id').on(table.commentId)
  ]
)
