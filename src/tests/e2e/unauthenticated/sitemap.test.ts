import { expect, test } from '@playwright/test'
import { SyntaxValidator } from 'fast-xml-validator'

test.describe('sitemap page', () => {
  test('validates sitemap xml', async ({ page }) => {
    await page.goto('/sitemap.xml')

    const feed = await page.content()
    const result = SyntaxValidator.validate(feed)

    expect(result).toBe(true)
  })
})
