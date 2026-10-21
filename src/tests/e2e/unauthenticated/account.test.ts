import { expect, test } from '../fixtures/test'

test.describe('account route protection', () => {
  for (const prefix of ['', '/zh-TW']) {
    for (const path of ['/account', '/account/settings']) {
      test(`redirects unauthenticated visitors from ${prefix}${path} to ${prefix || '/'}`, async ({ page }) => {
        await page.goto(`${prefix}${path}`)

        await expect(page).toHaveURL(prefix || '/')
      })
    }
  }
})
