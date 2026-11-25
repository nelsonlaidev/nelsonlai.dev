import { test as teardown } from '@playwright/test'
import { users } from '@repo/db/schema/auth'
import { comments } from '@repo/db/schema/comments'
import { guestbookMessages } from '@repo/db/schema/guestbook'
import { and, eq, isNotNull } from 'drizzle-orm'

import { db } from '@/lib/db'

import { TEST_UNIQUE_ID } from './fixtures/auth'

teardown('teardown global', async () => {
  await db.delete(comments).where(and(eq(comments.userId, TEST_UNIQUE_ID), isNotNull(comments.parentId)))
  await db.delete(comments).where(eq(comments.userId, TEST_UNIQUE_ID))
  await db.delete(guestbookMessages).where(eq(guestbookMessages.userId, TEST_UNIQUE_ID))
  await db.delete(users).where(eq(users.id, TEST_UNIQUE_ID))
})
