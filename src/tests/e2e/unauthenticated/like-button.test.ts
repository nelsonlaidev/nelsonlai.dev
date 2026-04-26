import { expect, test } from '@playwright/test'

import { COMMENT_DELETE_AND_LIKE_POST_SLUG } from '../fixtures/posts'
import { getNumberFlow } from '../utils/number-flow'

test.describe('like button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/blog/${COMMENT_DELETE_AND_LIKE_POST_SLUG}`)
  })

  test('likes a post', async ({ page }) => {
    const likeCount = page.getByTestId('like-count')
    const likeButton = page.getByTestId('like-button')

    await expect(likeCount).toBeVisible()
    expect(await getNumberFlow(likeCount)).toBe('0')

    await likeButton.click()
    expect(await getNumberFlow(likeCount)).toBe('1')

    await likeButton.click()
    await likeButton.click()
    expect(await getNumberFlow(likeCount)).toBe('3')
  })
})
