import { relations } from 'drizzle-orm'
import { boolean, pgTable, text } from 'drizzle-orm/pg-core'

import { DEFAULT_SETTINGS } from '../constants'
import { users } from './auth.schema'
import { createdAt, updatedAt } from './shared.schema'

export const settings = pgTable('settings', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  replyNotificationsEnabled: boolean('reply_notifications_enabled')
    .notNull()
    .default(DEFAULT_SETTINGS.replyNotificationsEnabled),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

export const settingsRelations = relations(settings, ({ one }) => ({
  user: one(users, {
    fields: [settings.userId],
    references: [users.id],
  }),
}))
