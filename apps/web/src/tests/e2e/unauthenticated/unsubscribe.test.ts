import en from '@messages/en.json' with { type: 'json' }
import { createId } from '@paralleldrive/cuid2'
import { comments, posts } from '@repo/db/schema/index'
import { eq } from 'drizzle-orm'
import { SignJWT } from 'jose'

import { ENV } from '@/env'
import { db } from '@/lib/db'

import { TEST_UNIQUE_ID } from '../fixtures/auth'
import { expect, test } from '../fixtures/test'

test.describe('unsubscribe', () => {
  let commentId: string

  test.beforeEach(async () => {
    commentId = createId()

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
      .setIssuer(ENV.SITE_URL)
      .setAudience('comment-reply-unsubscribe')
      .setExpirationTime('30d')
      .sign(new TextEncoder().encode(ENV.JWT_SECRET))

    await page.goto(`/unsubscribe?${new URLSearchParams({ token })}`)

    const unsubscribeButton = page.getByRole('button', { name: en.common_labels_unsubscribe, exact: true })
    const successMessage = page.getByText(en.unsubscribe_you_have_been_unsubscribed, { exact: true })
    const successDescription = page.getByText(en.unsubscribe_unsubscribed_description, { exact: true })

    await expect(
      page.getByRole('heading', { name: en.unsubscribe_unsubscribe_from_this_comment, exact: true }),
    ).toBeVisible()
    await expect(page.getByText(`Comment ${commentId}`, { exact: true })).toBeVisible()
    await expect(unsubscribeButton).toBeEnabled()
    await expect(successMessage).toBeHidden()
    expect(await db.query.commentReplyUnsubscribes.findMany({ where: { commentId: commentId } })).toEqual([])

    await unsubscribeButton.click()

    await expect(successMessage).toBeVisible()
    await expect(successDescription).toBeVisible()
    await expect(unsubscribeButton).toBeHidden()

    const records = await db.query.commentReplyUnsubscribes.findMany({ where: { commentId: commentId } })
    expect(records).toMatchObject([{ userId: TEST_UNIQUE_ID, commentId }])

    await page.reload()

    await expect(successMessage).toBeVisible()
    await expect(successDescription).toBeVisible()
    await expect(unsubscribeButton).toBeHidden()
    expect(await db.query.commentReplyUnsubscribes.findMany({ where: { commentId: commentId } })).toEqual(records)
  })

  for (const { tokenType, path } of [
    { tokenType: 'missing', path: '/unsubscribe' },
    { tokenType: 'empty', path: '/unsubscribe?token=' },
    { tokenType: 'malformed', path: '/unsubscribe?token=invalid-token' },
  ]) {
    test(`shows an error when the token is ${tokenType} without unsubscribing`, async ({ page }) => {
      await page.goto(path)

      await expect(page.getByText(en.unsubscribe_invalid_unsubscribe_link, { exact: true })).toBeVisible()
      await expect(page.getByText(en.unsubscribe_invalid_link_description, { exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: en.common_labels_unsubscribe, exact: true })).toBeHidden()
      await expect(page.getByText(en.unsubscribe_you_have_been_unsubscribed, { exact: true })).toBeHidden()
      expect(await db.query.commentReplyUnsubscribes.findMany({ where: { commentId: commentId } })).toEqual([])
    })
  }

  for (const { tokenType, secret, expiration } of [
    { tokenType: 'incorrectly signed', secret: `${ENV.JWT_SECRET}-invalid`, expiration: '30d' },
    { tokenType: 'expired', secret: ENV.JWT_SECRET, expiration: 0 },
  ]) {
    test(`shows an error when the token is ${tokenType} without unsubscribing`, async ({ page }) => {
      const token = await new SignJWT({ type: 'comment_reply', userId: TEST_UNIQUE_ID, commentId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuer(ENV.SITE_URL)
        .setAudience('comment-reply-unsubscribe')
        .setExpirationTime(expiration)
        .sign(new TextEncoder().encode(secret))

      await page.goto(`/unsubscribe?${new URLSearchParams({ token })}`)

      await expect(page.getByText(en.unsubscribe_invalid_unsubscribe_link, { exact: true })).toBeVisible()
      await expect(page.getByText(en.unsubscribe_invalid_link_description, { exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: en.common_labels_unsubscribe, exact: true })).toBeHidden()
      await expect(page.getByText(en.unsubscribe_you_have_been_unsubscribed, { exact: true })).toBeHidden()
      expect(await db.query.commentReplyUnsubscribes.findMany({ where: { commentId: commentId } })).toEqual([])
    })
  }
})
