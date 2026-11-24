import en from '@messages/en.json' with { type: 'json' }
import zhTW from '@messages/zh-TW.json' with { type: 'json' }
import { createId } from '@paralleldrive/cuid2'
import { sessions, users } from '@repo/db/schema/auth'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'

import { expect, test as base } from '../fixtures/test'
import { createSessionCookie } from '../utils/auth'

const test = base.extend<{
  isolatedSession: {
    userId: string
    token: string
    otherToken: string
    expiresAt: Date
  }
}>({
  isolatedSession: async ({ context, page }, provide) => {
    const userId = createId()
    const token = createId()
    const otherToken = createId()
    const expiresAt = new Date(Date.now() + 86_400_000)
    const userAgent = await page.evaluate(() => navigator.userAgent)

    await db
      .insert(users)
      .values({ id: userId, name: 'Session Test User', email: `${userId}@example.com`, emailVerified: false })

    try {
      await db.insert(sessions).values([
        { id: createId(), userId, token, expiresAt, userAgent },
        { id: createId(), userId, token: otherToken, expiresAt, userAgent },
      ])

      await context.addCookies([createSessionCookie(token, expiresAt)])
      await provide({ userId, token, otherToken, expiresAt })
    } finally {
      await db.delete(users).where(eq(users.id, userId))
    }
  },
})

test.use({ storageState: { cookies: [], origins: [] } })

test.describe('session lifecycle', () => {
  for (const { label, userAgent } of [
    { label: 'missing', userAgent: null },
    { label: 'empty', userAgent: '' },
  ]) {
    test(`renders and revokes a session with ${label} User-Agent metadata`, async ({ page, isolatedSession }) => {
      await db.update(sessions).set({ userAgent }).where(eq(sessions.token, isolatedSession.otherToken))

      await page.goto('/account')

      const revokeButtons = page.getByRole('button', { name: en.account_revoke_session, exact: true })
      await expect(revokeButtons).toHaveCount(2)

      const unknownSession = page
        .locator('[data-slot="card"]')
        .filter({ has: page.getByRole('button', { name: en.account_revoke_session, exact: true }) })
        .filter({ hasNot: page.getByText(en.account_this_device, { exact: true }) })

      // Browser, operating system, and IP address are all unknown for this session.
      await expect(unknownSession.getByText(en.common_unknown, { exact: true })).toHaveCount(3)
      await expect(page.getByText(en.account_this_device, { exact: true })).toBeVisible()

      await unknownSession.getByRole('button', { name: en.account_revoke_session, exact: true }).click()

      await expect(revokeButtons).toHaveCount(1)
      await expect(page.getByText(en.account_this_device, { exact: true })).toBeVisible()
      await expect(page).toHaveURL('/account')
      expect(await db.query.sessions.findFirst({ where: { token: isolatedSession.otherToken } })).toBeUndefined()
    })
  }

  for (const { prefix, messages } of [
    { prefix: '', messages: en },
    { prefix: '/zh-TW', messages: zhTW },
  ]) {
    test(`signs out from ${prefix || '/'} and loses access to protected pages and RPCs`, async ({
      page,
      isolatedSession,
    }) => {
      await page.goto(`${prefix}/guestbook`)
      await expect(page.getByRole('textbox')).toBeVisible()

      await page.getByRole('button', { name: messages.common_sign_out, exact: true }).click()

      await expect(page.getByRole('textbox')).toBeDisabled()
      await expect(
        page.getByRole('main').getByRole('button', { name: messages.common_sign_in, exact: true }),
      ).toBeVisible()
      expect(await db.query.sessions.findFirst({ where: { token: isolatedSession.token } })).toBeUndefined()

      await page.goto(`${prefix}/account/settings`)
      await expect(page).toHaveURL(prefix || '/')

      const response = await page.request.post('/api/rpc/notifications/getEmailPreferences', { data: { json: {} } })
      expect(response.status()).toBe(401)
      expect(await response.json()).toMatchObject({ json: { code: 'UNAUTHORIZED' } })
    })
  }

  test('revokes the current session and rejects its token afterward', async ({ page, isolatedSession }) => {
    await page.goto('/account')

    const currentSession = page
      .locator('[data-slot="card"]')
      .filter({ has: page.getByText(en.account_this_device, { exact: true }) })
    await currentSession.getByRole('button', { name: en.account_revoke_session, exact: true }).click()

    await expect(page).toHaveURL('/')
    expect(await db.query.sessions.findFirst({ where: { token: isolatedSession.token } })).toBeUndefined()

    await page.context().addCookies([createSessionCookie(isolatedSession.token, isolatedSession.expiresAt)])
    await page.goto('/account')
    await expect(page).toHaveURL('/')

    const response = await page.request.post('/api/rpc/account/listSessions', { data: { json: {} } })
    expect(response.status()).toBe(401)
  })

  test('revokes another session while keeping the current session signed in', async ({
    page,
    browser,
    isolatedSession,
    extraHTTPHeaders,
    baseURL,
  }) => {
    const otherContext = await browser.newContext({
      baseURL,
      extraHTTPHeaders,
      storageState: {
        cookies: [createSessionCookie(isolatedSession.otherToken, isolatedSession.expiresAt)],
        origins: [],
      },
    })

    try {
      const before = await otherContext.request.get('/api/auth/get-session')
      expect(await before.json()).toMatchObject({ user: { id: isolatedSession.userId } })

      await page.goto('/account')
      const revokeButtons = page.getByRole('button', { name: en.account_revoke_session, exact: true })
      await expect(revokeButtons).toHaveCount(2)
      await revokeButtons.nth(1).click()

      await expect(revokeButtons).toHaveCount(1)
      await expect(page.getByText(en.account_this_device, { exact: true })).toBeVisible()
      await expect(page).toHaveURL('/account')

      const current = await page.request.get('/api/auth/get-session')
      expect(await current.json()).toMatchObject({ user: { id: isolatedSession.userId } })

      const revoked = await otherContext.request.post('/api/rpc/account/listSessions', { data: { json: {} } })
      expect(revoked.status()).toBe(401)
      expect(await db.query.sessions.findFirst({ where: { token: isolatedSession.otherToken } })).toBeUndefined()
    } finally {
      await otherContext.close()
    }
  })
})
