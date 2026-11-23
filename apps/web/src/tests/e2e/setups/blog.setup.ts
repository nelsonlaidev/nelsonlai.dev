import { test as setup } from '@playwright/test'
import { comments, posts } from '@repo/db/schema/index'
import { and, eq, isNotNull } from 'drizzle-orm'

import { db } from '@/lib/db'

import { TEST_UNIQUE_ID } from '../fixtures/auth'
import { TEST_POSTS } from '../fixtures/posts'

setup('setup blog', async () => {
  await db.delete(comments).where(and(eq(comments.userId, TEST_UNIQUE_ID), isNotNull(comments.parentId)))
  await db.delete(comments).where(eq(comments.userId, TEST_UNIQUE_ID))

  await Promise.all(
    TEST_POSTS.map((post) =>
      db
        .insert(posts)
        .values({
          slug: post.slug,
          views: 0,
          likes: 0,
        })
        .onConflictDoNothing({ target: posts.slug }),
    ),
  )
})
