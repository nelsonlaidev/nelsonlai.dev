import { sql } from 'drizzle-orm'
import { check, index, integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

import { createdAt } from './helpers'

export const posts = pgTable(
  'posts',
  {
    slug: text('slug').primaryKey(),
    likes: integer('likes').notNull().default(0),
    views: integer('views').notNull().default(0),
    createdAt: createdAt(),
  },
  (table) => [index('posts_created_at_desc_idx').on(table.createdAt.desc())],
)

export const postLikes = pgTable(
  'post_likes',
  {
    postSlug: text('post_slug')
      .notNull()
      .references(() => posts.slug, { onDelete: 'cascade' }),
    anonKey: text('anon_key').notNull(),
    likeCount: integer('like_count').notNull().default(0),
    createdAt: createdAt(),
  },
  (table) => [
    primaryKey({ columns: [table.postSlug, table.anonKey] }),
    check('post_likes_count_check', sql`${table.likeCount} BETWEEN 0 AND 3`),
  ],
)
