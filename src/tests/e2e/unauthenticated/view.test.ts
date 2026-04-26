import { expect, test } from '@playwright/test'

import { COMMENT_SUBMIT_AND_VIEW_POST_SLUG } from '../fixtures/posts'
import { getNumberFlow } from '../utils/number-flow'

test.describe('views', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}`)
  })

  test('counts a view', async ({ page }) => {
    const viewCount = page.getByTestId('view-count')

    await expect(viewCount).toBeVisible()
    const initialViewCount = Number.parseInt(String(await getNumberFlow(viewCount)), 10)

    // Ensure the view count is incremented
    await page.reload()

    const viewCountValue = String(await getNumberFlow(viewCount))

    expect(Number.parseInt(viewCountValue, 10)).toBeGreaterThan(initialViewCount)
  })
})
