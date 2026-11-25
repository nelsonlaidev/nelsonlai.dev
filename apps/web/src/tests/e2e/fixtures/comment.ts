import { createId } from '@paralleldrive/cuid2'
import { comments } from '@repo/db/schema/comments'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'

import { TEST_UNIQUE_ID } from './auth'
import { COMMENT_SUBMIT_AND_VIEW_POST_SLUG } from './posts'
import { test as base } from './test'

export const test = base.extend<{ savedComment: { id: string; postSlug: string } }>({
  // Playwright requires fixture dependencies to be destructured.
  // oxlint-disable-next-line no-empty-pattern
  savedComment: async ({}, provide) => {
    const comment = { id: createId(), postSlug: COMMENT_SUBMIT_AND_VIEW_POST_SLUG }
    await db.insert(comments).values({ ...comment, userId: TEST_UNIQUE_ID, body: 'Test comment' })
    try {
      await provide(comment)
    } finally {
      await db.delete(comments).where(eq(comments.id, comment.id))
    }
  },
})

export { expect } from './test'
