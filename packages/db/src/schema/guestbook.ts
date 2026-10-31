import { createId } from '@paralleldrive/cuid2'
import { defineRelationsPart } from 'drizzle-orm'
import { index, pgTable, text } from 'drizzle-orm/pg-core'

import { users } from './auth'
import { createdAt, updatedAt } from './helpers'

export const guestbookMessages = pgTable(
  'guestbook_messages',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    body: text('body').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index('guestbook_messages_created_at_id_desc_idx').on(
      table.createdAt.desc().nullsFirst(),
      table.id.desc().nullsFirst(),
    ),
    index('guestbook_messages_user_id_idx').on(table.userId),
  ],
)

export const guestbookRelations = defineRelationsPart({ guestbookMessages, users }, (r) => ({
  guestbookMessages: {
    user: r.one.users({
      from: r.guestbookMessages.userId,
      to: r.users.id,
      optional: false,
    }),
  },
}))
