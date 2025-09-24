import { expect, test } from '@playwright/test'
import { XMLValidator } from 'fast-xml-parser'

test.describe('rss page', () => {
  test('validates rss xml', async ({ page }) => {
    await page.goto('/rss.xml')

    const feed = await page.content()
    const result = XMLValidator.validate(feed)

    expect(result).toBe(true)
  })
})
