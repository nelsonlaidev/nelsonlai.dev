import { relations } from 'drizzle-orm'
import { index, integer, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'

import { posts } from './post.schema'

export const postLikes = pgTable(
  'post_like',
  {
    postId: text('post_id')
      .notNull()
      .references(() => posts.slug),
    anonKey: text('anon_key').notNull(),
    likes: integer('likes').notNull().default(0),
    createdAt: timestamp('created_at')
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: timestamp('updated_at')
      .notNull()
      .$defaultFn(() => new Date())
  },
  (postLike) => [
    primaryKey({ columns: [postLike.postId, postLike.anonKey] }),
    index('idx_post_like_post').on(postLike.postId)
  ]
)

export const postLikesRelation = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.slug]
  })
}))
