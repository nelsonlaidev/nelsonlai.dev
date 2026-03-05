import { test as teardown } from '@playwright/test'
import { eq, inArray } from 'drizzle-orm'

import { db } from '@/db'
import { comments, messages, postLikes, posts, users } from '@/db/schemas'
import { redis } from '@/lib/kv'

import { TEST_UNIQUE_ID } from './fixtures/auth'
import { TEST_POSTS } from './fixtures/posts'

const TEST_SLUGS = TEST_POSTS.map((post) => post.slug)

teardown('teardown global', async () => {
  await db.delete(comments).where(eq(comments.userId, TEST_UNIQUE_ID))
  await db.delete(messages).where(eq(messages.userId, TEST_UNIQUE_ID))
  await db.delete(postLikes).where(inArray(postLikes.postId, TEST_SLUGS))
  await db.delete(posts).where(inArray(posts.slug, TEST_SLUGS))
  await db.delete(users).where(eq(users.id, TEST_UNIQUE_ID))

  await redis.flushall()
})
