import { expect, test } from '@playwright/test'
import { SyntaxValidator } from 'fast-xml-validator'

test.describe('rss page', () => {
  test('validates rss xml', async ({ page }) => {
    await page.goto('/rss.xml')

    const feed = await page.content()
    const result = SyntaxValidator.validate(feed)

    expect(result).toBe(true)
  })
})
