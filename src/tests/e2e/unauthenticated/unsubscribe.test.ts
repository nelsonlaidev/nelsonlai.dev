import { createId } from '@paralleldrive/cuid2'
import { eq } from 'drizzle-orm'
import { SignJWT } from 'jose'

import { db } from '@/db'
import { comments, posts, unsubscribes } from '@/db/schemas'
import { ENV } from '@/env'
import en from '@/i18n/messages/en.json' with { type: 'json' }

import { TEST_UNIQUE_ID } from '../fixtures/auth'
import { expect, test } from '../fixtures/test'

test.describe('unsubscribe', () => {
  let commentId: string

  test.beforeEach(async () => {
    commentId = createId()

    if (!ENV.JWT_SECRET) {
      throw new Error('JWT_SECRET must be set to run unsubscribe E2E tests')
    }

    await db.insert(posts).values({ slug: `unsubscribe-${commentId}` })
    await db.insert(comments).values({
      id: commentId,
      body: `Comment ${commentId}`,
      postId: `unsubscribe-${commentId}`,
      userId: TEST_UNIQUE_ID,
    })
  })

  test.afterEach(async () => {
    // Deleting the isolated post also removes its comment and unsubscribe records.
    await db.delete(posts).where(eq(posts.slug, `unsubscribe-${commentId}`))
  })

  test('unsubscribes with a valid token and preserves the result after reloading', async ({ page }) => {
    const token = await new SignJWT({ type: 'comment_reply', userId: TEST_UNIQUE_ID, commentId })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(new TextEncoder().encode(ENV.JWT_SECRET))

    await page.goto(`/unsubscribe?${new URLSearchParams({ token })}`)

    const unsubscribeButton = page.getByRole('button', { name: en.common.labels.unsubscribe, exact: true })
    const successMessage = page.getByText(en.unsubscribe['you-have-been-unsubscribed'], { exact: true })
    const successDescription = page.getByText(en.unsubscribe['unsubscribed-description'], { exact: true })

    await expect(page.getByText(en.unsubscribe['unsubscribe-from-this-comment'], { exact: true })).toBeVisible()
    await expect(page.getByText(`Comment ${commentId}`, { exact: true })).toBeVisible()
    await expect(unsubscribeButton).toBeEnabled()
    await expect(successMessage).toBeHidden()
    expect(await db.query.unsubscribes.findMany({ where: eq(unsubscribes.commentId, commentId) })).toEqual([])

    await unsubscribeButton.click()

    await expect(successMessage).toBeVisible()
    await expect(successDescription).toBeVisible()
    await expect(unsubscribeButton).toBeHidden()

    const records = await db.query.unsubscribes.findMany({ where: eq(unsubscribes.commentId, commentId) })
    expect(records).toMatchObject([{ userId: TEST_UNIQUE_ID, commentId, type: 'comment_reply' }])

    await page.reload()

    await expect(successMessage).toBeVisible()
    await expect(successDescription).toBeVisible()
    await expect(unsubscribeButton).toBeHidden()
    expect(await db.query.unsubscribes.findMany({ where: eq(unsubscribes.commentId, commentId) })).toEqual(records)
  })

  for (const { tokenType, path } of [
    { tokenType: 'missing', path: '/unsubscribe' },
    { tokenType: 'empty', path: '/unsubscribe?token=' },
    { tokenType: 'malformed', path: '/unsubscribe?token=invalid-token' },
  ]) {
    test(`shows an error when the token is ${tokenType} without unsubscribing`, async ({ page }) => {
      await page.goto(path)

      await expect(page.getByText(en.unsubscribe['invalid-unsubscribe-link'], { exact: true })).toBeVisible()
      await expect(page.getByText(en.unsubscribe['invalid-link-description'], { exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: en.common.labels.unsubscribe, exact: true })).toBeHidden()
      await expect(page.getByText(en.unsubscribe['you-have-been-unsubscribed'], { exact: true })).toBeHidden()
      expect(await db.query.unsubscribes.findMany({ where: eq(unsubscribes.commentId, commentId) })).toEqual([])
    })
  }

  for (const { tokenType, secret, expiration } of [
    { tokenType: 'incorrectly signed', secret: `${ENV.JWT_SECRET}-invalid`, expiration: '30d' },
    { tokenType: 'expired', secret: ENV.JWT_SECRET, expiration: 0 },
  ]) {
    test(`shows an error when the token is ${tokenType} without unsubscribing`, async ({ page }) => {
      const token = await new SignJWT({ type: 'comment_reply', userId: TEST_UNIQUE_ID, commentId })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(expiration)
        .sign(new TextEncoder().encode(secret))

      await page.goto(`/unsubscribe?${new URLSearchParams({ token })}`)

      await expect(page.getByText(en.unsubscribe['invalid-unsubscribe-link'], { exact: true })).toBeVisible()
      await expect(page.getByText(en.unsubscribe['invalid-link-description'], { exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: en.common.labels.unsubscribe, exact: true })).toBeHidden()
      await expect(page.getByText(en.unsubscribe['you-have-been-unsubscribed'], { exact: true })).toBeHidden()
      expect(await db.query.unsubscribes.findMany({ where: eq(unsubscribes.commentId, commentId) })).toEqual([])
    })
  }
})
