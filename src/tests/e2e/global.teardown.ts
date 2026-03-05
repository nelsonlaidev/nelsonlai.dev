import { test as teardown } from '@playwright/test'
import { eq, like } from 'drizzle-orm'

import { db } from '@/db'
import { comments, messages, postLikes, posts, users } from '@/db/schemas'
import { redis } from '@/lib/kv'

import { TEST_UNIQUE_ID } from './fixtures/auth'

teardown('teardown global', async () => {
  await db.delete(comments).where(eq(comments.userId, TEST_UNIQUE_ID))
  await db.delete(messages).where(eq(messages.userId, TEST_UNIQUE_ID))
  await db.delete(postLikes).where(like(postLikes.postId, 'test%'))
  await db.delete(posts).where(like(posts.slug, 'test%'))
  await db.delete(users).where(eq(users.id, TEST_UNIQUE_ID))

  await redis.flushall()
})
