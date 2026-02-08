import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { DEFAULT_SETTINGS } from '@/db/constants'

import { users } from './auth.schema'

export const settings = pgTable('settings', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at')
    .notNull()
    .$defaultFn(() => new Date()),
  replyNotificationsEnabled: boolean('reply_notifications_enabled')
    .notNull()
    .default(DEFAULT_SETTINGS.replyNotificationsEnabled),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
})
