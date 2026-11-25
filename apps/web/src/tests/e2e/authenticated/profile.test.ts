import type { Page } from '@playwright/test'

import path from 'node:path'

import en from '@messages/en.json' with { type: 'json' }
import { AVATAR_MAX_FILE_SIZE } from '@repo/api/schema/account'
import { users } from '@repo/db/schema/auth'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'

import { TEST_UNIQUE_ID } from '../fixtures/auth'
import { expect, test } from '../fixtures/test'
import { rejectRpc, toastTitle } from '../utils/toast'

test.describe('profile toasts', () => {
  test('shows a success toast after saving the display name', async ({ page }) => {
    await page.goto('/account')
    await page.getByRole('button', { name: en.account_edit_name }).click()
    const input = page.getByRole('textbox', { name: en.account_display_name })
    const previous = await input.inputValue()
    try {
      await input.fill('Updated Reader')
      await page.getByRole('button', { name: en.common_save }).click()
      await expect(toastTitle(page, 'success', en.success_name_updated)).toBeVisible()
      await expect(page.getByRole('main').getByText('Updated Reader', { exact: true })).toBeVisible()
    } finally {
      await db.update(users).set({ name: previous }).where(eq(users.id, TEST_UNIQUE_ID))
    }
  })

  for (const [code, title] of [
    ['INTERNAL_SERVER_ERROR', en.error_update_name_failed],
    ['TOO_MANY_REQUESTS', en.error_too_many_requests],
  ] as const) {
    test(`shows a toast when editing the display name returns ${code}`, async ({ page }) => {
      await rejectRpc(page, 'account/updateName', code)
      await page.goto('/account')
      await page.getByRole('button', { name: en.account_edit_name }).click()
      await page.getByRole('textbox', { name: en.account_display_name }).fill('Updated Reader')
      await page.getByRole('button', { name: en.common_save }).click()
      await expect(toastTitle(page, 'error', title)).toBeVisible()
    })
  }

  for (const [code, title] of [
    [null, en.success_avatar_updated],
    ['INTERNAL_SERVER_ERROR', en.error_update_avatar_failed],
    ['TOO_MANY_REQUESTS', en.error_too_many_requests],
  ] as const) {
    const respondToUpload = code
      ? async (page: Page) => rejectRpc(page, 'account/updateAvatar', code)
      : async (page: Page) =>
          page.route('**/api/rpc/account/updateAvatar', async (route) => route.fulfill({ json: {} }))

    test(`uploading an avatar reports ${code ?? 'success'}`, async ({ page }) => {
      await page.goto('/account')
      await respondToUpload(page)
      await page
        .getByLabel(en.account_update_avatar, { exact: true })
        .setInputFiles(path.join(import.meta.dirname, '../../../../public/images/avatar.png'))
      await expect(toastTitle(page, code ? 'error' : 'success', title)).toBeVisible()
    })
  }

  const sizeError = en.error_avatar_too_large.replace('{size}', String(AVATAR_MAX_FILE_SIZE / 1024 / 1024))
  for (const [label, mimeType, size, title] of [
    ['unsupported', 'text/plain', 1, en.error_avatar_unsupported_file],
    ['empty', 'image/png', 0, sizeError],
    ['oversized', 'image/png', AVATAR_MAX_FILE_SIZE + 1, sizeError],
  ] as const) {
    test(`rejects an ${label} avatar before upload`, async ({ page }) => {
      await page.goto('/account')
      const uploads: string[] = []
      await page.route('**/api/rpc/account/updateAvatar', async (route) => {
        uploads.push(route.request().url())
        await route.abort()
      })
      await page.getByLabel(en.account_update_avatar, { exact: true }).setInputFiles({
        name: 'avatar',
        mimeType,
        buffer: Buffer.alloc(size),
      })
      await expect(toastTitle(page, 'error', title)).toBeVisible()
      expect(uploads).toHaveLength(0)
    })
  }
})
