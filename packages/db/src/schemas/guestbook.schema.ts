import { relations } from 'drizzle-orm'
import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { users } from './auth.schema'

export const guestbook = pgTable(
  'guestbook',
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
      .$defaultFn(() => new Date())
  },
  (table) => [
    index('idx_guestbook_created').on(table.createdAt.desc()),
    index('idx_guestbook_user_id').on(table.userId)
  ]
)

export const guestbookRelations = relations(guestbook, ({ one }) => ({
  user: one(users, {
    fields: [guestbook.userId],
    references: [users.id]
  })
}))
