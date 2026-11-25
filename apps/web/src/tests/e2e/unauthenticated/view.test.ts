import { COMMENT_SUBMIT_AND_VIEW_POST_SLUG } from '../fixtures/posts'
import { expect, test } from '../fixtures/test'
import { getNumberFlow } from '../utils/number-flow'

test.describe('views', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}`)
  })

  test('counts a view', async ({ page }) => {
    const viewCount = page.getByTestId('view-count')

    await expect(viewCount).toBeVisible()
    const initialViewCount = Number(String(await getNumberFlow(viewCount)).replaceAll(',', ''))

    // Ensure the view count is incremented
    await page.reload()

    await expect
      .poll(async () => Number(String(await getNumberFlow(viewCount)).replaceAll(',', '')))
      .toBeGreaterThan(initialViewCount)
  })
})
