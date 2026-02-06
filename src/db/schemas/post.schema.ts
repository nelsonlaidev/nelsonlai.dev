import { relations } from 'drizzle-orm'
import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { comments } from './comment.schema'

export const posts = pgTable(
  'posts',
  {
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    slug: text('slug').primaryKey(),
    likes: integer('likes').notNull().default(0),
    views: integer('views').notNull().default(0),
  },
  (table) => [index('posts_created_at_desc_idx').on(table.createdAt.desc())],
)

export const postsRelations = relations(posts, ({ many }) => ({
  comments: many(comments),
}))
