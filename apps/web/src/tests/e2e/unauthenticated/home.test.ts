import { test } from '../fixtures/test'
import { a11y } from '../utils/a11y'

test.describe('homepage', () => {
  test('audits a11y issues', async ({ page }) => {
    await page.goto('/')

    await a11y({ page })
  })
})
