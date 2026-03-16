import { relations } from 'drizzle-orm'
import { index, integer, pgTable, text } from 'drizzle-orm/pg-core'

import { comments } from './comment.schema'
import { postLikes } from './post-like.schema'
import { createdAt } from './shared.schema'

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

export const postsRelations = relations(posts, ({ many }) => ({
  comments: many(comments),
  postLikes: many(postLikes),
}))
