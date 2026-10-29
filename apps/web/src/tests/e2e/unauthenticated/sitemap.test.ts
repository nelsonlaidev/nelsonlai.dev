import { SyntaxValidator } from 'fast-xml-validator'

import { expect, test } from '../fixtures/test'

test.describe('sitemap page', () => {
  test('validates sitemap xml', async ({ page }) => {
    await page.goto('/sitemap.xml')

    const feed = await page.content()
    const result = SyntaxValidator.validate(feed)

    expect(result).toBe(true)
  })
})
