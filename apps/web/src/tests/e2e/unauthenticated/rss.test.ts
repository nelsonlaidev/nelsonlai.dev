import { SyntaxValidator } from 'fast-xml-validator'

import { expect, test } from '../fixtures/test'

test.describe('rss page', () => {
  test('validates rss xml', async ({ page }) => {
    await page.goto('/rss.xml')

    const feed = await page.content()
    const result = SyntaxValidator.validate(feed)

    expect(result).toBe(true)
  })
})
