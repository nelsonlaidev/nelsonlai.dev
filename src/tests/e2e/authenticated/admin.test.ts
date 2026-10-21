import { TEST_UNIQUE_ID } from '../fixtures/auth'
import { expect, test } from '../fixtures/test'

test.describe('admin route protection', () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.request.get('/api/auth/get-session')

    await expect(response).toBeOK()
    expect(await response.json()).toMatchObject({
      user: { id: TEST_UNIQUE_ID, role: 'user' },
    })
  })

  for (const prefix of ['', '/zh-TW']) {
    for (const path of ['/admin', '/admin/users', '/admin/comments']) {
      test(`redirects regular members from ${prefix}${path} to ${prefix || '/'}`, async ({ page }) => {
        await page.goto(`${prefix}${path}`)

        await expect(page).toHaveURL(prefix || '/')
      })
    }
  }

  for (const path of ['stats', 'user/list', 'comment/list', 'recentActivity', 'trends']) {
    test(`rejects direct access to /rpc/admin/${path} for regular members`, async ({ request }) => {
      const response = await request.post(`/rpc/admin/${path}`, {
        data: { json: path === 'trends' ? { days: 7, timezone: 'UTC' } : {} },
      })

      expect(response.status()).toBe(403)
      expect(await response.json()).toMatchObject({ json: { code: 'FORBIDDEN' } })
    })
  }
})
