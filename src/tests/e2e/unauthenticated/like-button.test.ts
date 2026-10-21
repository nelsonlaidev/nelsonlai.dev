import type { LikeCountOutput } from '@/orpc/client'

import { and, eq } from 'drizzle-orm'

import { db } from '@/db'
import { postLikes } from '@/db/schemas'
import en from '@/i18n/messages/en.json' with { type: 'json' }
import { getAnonKey } from '@/utils/get-anon-key'

import { COMMENT_DELETE_AND_LIKE_POST_SLUG } from '../fixtures/posts'
import { expect, test } from '../fixtures/test'
import { getNumberFlow } from '../utils/number-flow'

test.describe('like button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/blog/${COMMENT_DELETE_AND_LIKE_POST_SLUG}`)
  })

  test('persists three likes and rejects a fourth after reloading', async ({ page, extraHTTPHeaders }) => {
    const likeCount = page.getByTestId('like-count')
    const likeButton = page.getByTestId('like-button')

    await expect(likeCount).toBeVisible()
    const initialCount = Number(await getNumberFlow(likeCount))
    const saved = page.waitForResponse(async (response) => {
      if (!response.url().includes('/rpc/like/increment') || !response.ok()) return false

      const body = (await response.json()) as { json: LikeCountOutput }
      return body.json.currentUserLikes === 3
    })

    await likeButton.click()
    expect(await getNumberFlow(likeCount)).toBe(String(initialCount + 1))

    await likeButton.click()
    await likeButton.click()

    await expect.poll(async () => getNumberFlow(likeCount)).toBe(String(initialCount + 3))

    const anonKey = getAnonKey(extraHTTPHeaders?.['x-real-ip'] ?? '')
    await expect
      .poll(async () => {
        const record = await db.query.postLikes.findFirst({
          where: and(eq(postLikes.postId, COMMENT_DELETE_AND_LIKE_POST_SLUG), eq(postLikes.anonKey, anonKey)),
        })
        return record?.likeCount
      })
      .toBe(3)

    await saved
    await page.reload()
    await expect(likeCount).toBeVisible()

    expect(await getNumberFlow(likeCount)).toBe(String(initialCount + 3))
    await likeButton.click()

    await expect(page.getByText(en.error['like-limit-reached'], { exact: true })).toBeVisible()
    expect(await getNumberFlow(likeCount)).toBe(String(initialCount + 3))

    const response = await page.request.post('/rpc/like/increment', {
      data: { json: { slug: COMMENT_DELETE_AND_LIKE_POST_SLUG, value: 1 } },
    })
    expect(response.status()).toBe(400)
    expect(await response.json()).toMatchObject({ json: { code: 'BAD_REQUEST' } })

    await page.reload()
    await expect(likeCount).toBeVisible()

    expect(await getNumberFlow(likeCount)).toBe(String(initialCount + 3))
    expect(
      await db.query.postLikes.findFirst({
        where: and(eq(postLikes.postId, COMMENT_DELETE_AND_LIKE_POST_SLUG), eq(postLikes.anonKey, anonKey)),
      }),
    ).toMatchObject({ likeCount: 3 })
  })
})
