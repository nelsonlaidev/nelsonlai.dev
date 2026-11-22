import { test as teardown } from '@playwright/test'
import { comments, guestbookMessages, postLikes, posts, users } from '@repo/db/schema/index'
import { and, eq, inArray, isNotNull } from 'drizzle-orm'

import { db } from '@/lib/db'

import { TEST_UNIQUE_ID } from './fixtures/auth'
import { COMMENT_DELETE_AND_LIKE_POST_SLUG, TEST_POSTS } from './fixtures/posts'

const TEST_SLUGS = TEST_POSTS.map((post) => post.slug)

teardown('teardown global', async () => {
  await db.delete(comments).where(and(eq(comments.userId, TEST_UNIQUE_ID), isNotNull(comments.parentId)))
  await db.delete(comments).where(eq(comments.userId, TEST_UNIQUE_ID))
  await db.delete(guestbookMessages).where(eq(guestbookMessages.userId, TEST_UNIQUE_ID))
  await db.delete(postLikes).where(inArray(postLikes.postSlug, TEST_SLUGS))
  await db.update(posts).set({ likes: 0 }).where(eq(posts.slug, COMMENT_DELETE_AND_LIKE_POST_SLUG))
  await db.delete(users).where(eq(users.id, TEST_UNIQUE_ID))
})
