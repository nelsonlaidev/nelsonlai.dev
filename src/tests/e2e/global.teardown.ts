import { test as teardown } from '@playwright/test'
import { and, eq, inArray, isNotNull } from 'drizzle-orm'

import { db } from '@/db'
import { comments, messages, postLikes, posts, users } from '@/db/schemas'
import { redis } from '@/lib/kv'

import { TEST_UNIQUE_ID } from './fixtures/auth'
import { COMMENT_DELETE_AND_LIKE_POST_SLUG, TEST_POSTS } from './fixtures/posts'

const TEST_SLUGS = TEST_POSTS.map((post) => post.slug)

teardown('teardown global', async () => {
  await db.delete(comments).where(and(eq(comments.userId, TEST_UNIQUE_ID), isNotNull(comments.parentId)))
  await db.delete(comments).where(eq(comments.userId, TEST_UNIQUE_ID))
  await db.delete(messages).where(eq(messages.userId, TEST_UNIQUE_ID))
  await db.delete(postLikes).where(inArray(postLikes.postId, TEST_SLUGS))
  await db.update(posts).set({ likes: 0 }).where(eq(posts.slug, COMMENT_DELETE_AND_LIKE_POST_SLUG))
  await db.delete(users).where(eq(users.id, TEST_UNIQUE_ID))

  await redis.flushall()
})
