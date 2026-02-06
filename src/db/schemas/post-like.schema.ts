import { relations, sql } from 'drizzle-orm'
import { check, integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

import { posts } from './post.schema'

export const postLikes = pgTable(
  'post_likes',
  {
    postId: text('post_id')
      .notNull()
      .references(() => posts.slug, { onDelete: 'cascade' }),
    anonKey: text('anon_key').notNull(),
    likeCount: integer('like_count').notNull().default(0),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (postLike) => [
    primaryKey({ columns: [postLike.postId, postLike.anonKey] }),
    check('post_likes_like_count_check', sql`${postLike.likeCount} BETWEEN 0 AND 3`),
  ],
)

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.slug],
  }),
}))
