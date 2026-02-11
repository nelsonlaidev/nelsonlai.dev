import { expect, test } from '@playwright/test'

import { getNumberFlow } from '../utils/number-flow'

test.describe('views', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/test-view')
  })

  test('counts a view', async ({ page }) => {
    const viewCount = page.getByTestId('view-count')

    await expect(viewCount).toBeVisible()

    // Ensure the view count is incremented
    await page.reload()

    const viewCountValue = String(await getNumberFlow(viewCount))

    expect(Number.parseInt(viewCountValue, 10)).toBeGreaterThan(0)
  })
})
