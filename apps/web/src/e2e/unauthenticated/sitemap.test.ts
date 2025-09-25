import { expect, test } from '@playwright/test'
import { XMLValidator } from 'fast-xml-parser'

test.describe('sitemap page', () => {
  test('validates sitemap xml', async ({ page }) => {
    await page.goto('/sitemap.xml')

    const feed = await page.content()
    const result = XMLValidator.validate(feed)

    expect(result).toBe(true)
  })
})
