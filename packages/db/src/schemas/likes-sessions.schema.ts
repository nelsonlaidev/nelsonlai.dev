import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const likesSessions = pgTable('likes_session', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at')
    .notNull()
    .$defaultFn(() => new Date()),
  likes: integer('likes').notNull().default(0)
})
