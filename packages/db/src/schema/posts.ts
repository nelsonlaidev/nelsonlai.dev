import { index, integer, pgTable, text } from 'drizzle-orm/pg-core'

import { createdAt } from './helpers'

export const posts = pgTable(
  'posts',
  {
    createdAt: createdAt(),
    slug: text('slug').primaryKey(),
    likes: integer('likes').notNull().default(0),
    views: integer('views').notNull().default(0),
  },
  (table) => [index('posts_created_at_desc_idx').on(table.createdAt.desc())],
)
