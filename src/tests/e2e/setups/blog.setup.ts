import { test as setup } from '@playwright/test'

import { db } from '@/db'
import { posts } from '@/db/schemas'

import { TEST_POSTS } from '../fixtures/posts'

setup('setup blog', async () => {
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
