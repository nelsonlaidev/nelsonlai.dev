import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const postLikes = pgTable('post_like', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at')
    .notNull()
    .$defaultFn(() => new Date()),
  likes: integer('likes').notNull().default(0)
})
