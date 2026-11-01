import type { PostLikesSchema } from '@repo/api/schema/posts'
import type * as z from 'zod'

import assert from 'node:assert/strict'

import en from '@messages/en.json' with { type: 'json' }
import { getAnonymousKey } from '@repo/api/lib/anonymous-key'

import { db } from '@/lib/db'

import { COMMENT_DELETE_AND_LIKE_POST_SLUG } from '../fixtures/posts'
import { expect, test } from '../fixtures/test'
import { getNumberFlow } from '../utils/number-flow'

type LikeCountOutput = z.infer<typeof PostLikesSchema>

test.describe('like button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/blog/${COMMENT_DELETE_AND_LIKE_POST_SLUG}`)
  })

  test('persists three likes and rejects a fourth after reloading', async ({ page, extraHTTPHeaders }) => {
    const likeCount = page.getByTestId('like-count').filter({ visible: true })
    const likeButton = page.getByRole('button', { name: en.blog_like_this_post, exact: true })

    await expect(likeCount).toBeVisible()
    const initialCount = Number(await getNumberFlow(likeCount))
    const saved = page.waitForResponse(async (response) => {
      if (!response.url().includes('/api/rpc/posts/like') || !response.ok()) return false

      const body = (await response.json()) as {
        json: LikeCountOutput
      }
      return body.json.currentUserLikes === 3
    })

    await likeButton.click()
    expect(await getNumberFlow(likeCount)).toBe(String(initialCount + 1))

    await likeButton.click()
    await likeButton.click()

    await expect.poll(async () => getNumberFlow(likeCount)).toBe(String(initialCount + 3))

    const anonKey = getAnonymousKey(new Headers(extraHTTPHeaders))
    await expect
      .poll(async () => {
        const record = await db.query.postLikes.findFirst({
          where: { postId: COMMENT_DELETE_AND_LIKE_POST_SLUG, anonKey },
        })
        return record?.likeCount
      })
      .toBe(3)

    await saved
    await page.reload()
    await expect(likeCount).toBeVisible()

    expect(await getNumberFlow(likeCount)).toBe(String(initialCount + 3))
    await expect(likeButton).toBeDisabled()
    // The aria-disabled control still handles pointer clicks to explain the limit.
    await likeButton.scrollIntoViewIfNeeded()
    const bounds = await likeButton.boundingBox()
    assert.ok(bounds, 'Expected the like button to be visible')
    await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)

    await expect(page.getByText(en.error_like_limit_reached, { exact: true })).toBeVisible()
    expect(await getNumberFlow(likeCount)).toBe(String(initialCount + 3))

    const response = await page.request.post('/api/rpc/posts/like', {
      data: { json: { slug: COMMENT_DELETE_AND_LIKE_POST_SLUG, value: 1 } },
    })
    expect(response.status()).toBe(400)
    expect(await response.json()).toMatchObject({ json: { code: 'BAD_REQUEST' } })

    await page.reload()
    await expect(likeCount).toBeVisible()

    expect(await getNumberFlow(likeCount)).toBe(String(initialCount + 3))
    expect(
      await db.query.postLikes.findFirst({
        where: { postId: COMMENT_DELETE_AND_LIKE_POST_SLUG, anonKey },
      }),
    ).toMatchObject({ likeCount: 3 })
  })
})
