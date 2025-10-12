import { index, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'
import { comments } from './comment.schema'

export const notificationTypeEnum = pgEnum('notification_type', ['all', 'comment'])

export const notifications = pgTable(
  'notifications',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    commentId: text('comment_id').references(() => comments.id, { onDelete: 'cascade' }),
    type: notificationTypeEnum('type').notNull(),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
  },
  (table) => [
    index('notifications_user_id_idx').on(table.userId),
    index('notifications_comment_id_idx').on(table.commentId)
  ]
)
