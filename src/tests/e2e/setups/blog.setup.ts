import { test as setup } from '@playwright/test'
import { and, eq, isNotNull } from 'drizzle-orm'

import { db } from '@/db'
import { comments, postLikes, posts } from '@/db/schemas'

import { TEST_UNIQUE_ID } from '../fixtures/auth'
import { COMMENT_DELETE_AND_LIKE_POST_SLUG, TEST_POSTS } from '../fixtures/posts'

setup('setup blog', async () => {
  await db.delete(comments).where(and(eq(comments.userId, TEST_UNIQUE_ID), isNotNull(comments.parentId)))
  await db.delete(comments).where(eq(comments.userId, TEST_UNIQUE_ID))
  await db.delete(postLikes).where(eq(postLikes.postId, COMMENT_DELETE_AND_LIKE_POST_SLUG))

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

  await db.update(posts).set({ likes: 0 }).where(eq(posts.slug, COMMENT_DELETE_AND_LIKE_POST_SLUG))
})
