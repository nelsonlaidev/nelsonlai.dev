import en from '@messages/en.json' with { type: 'json' }
import { commentNotificationPreferences } from '@repo/db/schema/comments'
import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'

import { TEST_UNIQUE_ID } from '../fixtures/auth'
import { expect, test } from '../fixtures/test'
import { rejectRpc, toastTitle } from '../utils/toast'

test.describe('account settings', () => {
  // These tests update the same user's commentNotificationPreferences.
  test.describe.configure({ mode: 'default' })

  test.beforeEach(async () => {
    await db.delete(commentNotificationPreferences).where(eq(commentNotificationPreferences.userId, TEST_UNIQUE_ID))
  })

  for (const [code, title] of [
    ['INTERNAL_SERVER_ERROR', en.error_update_notification_settings_failed],
    ['TOO_MANY_REQUESTS', en.error_too_many_requests],
  ] as const) {
    test(`shows an error toast when saving preferences returns ${code}`, async ({ page }) => {
      await rejectRpc(page, 'notifications/setEmailPreferences', code)
      await page.goto('/account/settings')
      await page.getByRole('switch', { name: en.settings_comment_replies }).click()
      await page.getByRole('button', { name: en.common_save }).click()
      await expect(toastTitle(page, 'error', title)).toBeVisible()
    })
  }

  test('loads default settings without allowing unchanged settings to be saved', async ({ page }) => {
    await page.goto('/account/settings')

    await expect(page.getByRole('switch', { name: en.settings_comment_replies })).toBeChecked()
    await expect(page.getByRole('button', { name: en.common_save, exact: true })).toBeDisabled()
    await expect(page.getByRole('button', { name: en.common_reset, exact: true })).toBeHidden()
  })

  test('resets unsaved notification changes', async ({ page }) => {
    await page.goto('/account/settings')

    const notificationSwitch = page.getByRole('switch', { name: en.settings_comment_replies })
    const saveButton = page.getByRole('button', { name: en.common_save, exact: true })
    const resetButton = page.getByRole('button', { name: en.common_reset, exact: true })

    await expect(notificationSwitch).toBeChecked()
    await notificationSwitch.click()

    await expect(notificationSwitch).not.toBeChecked()
    await expect(saveButton).toBeEnabled()
    await resetButton.click()

    await expect(notificationSwitch).toBeChecked()
    await expect(saveButton).toBeDisabled()
    await expect(resetButton).toBeHidden()

    await page.reload()

    await expect(notificationSwitch).toBeChecked()
  })

  for (const enabled of [false, true]) {
    test(`persists ${enabled ? 'enabled' : 'disabled'} reply notifications after reloading`, async ({ page }) => {
      await db.insert(commentNotificationPreferences).values({
        userId: TEST_UNIQUE_ID,
        commentRepliesEnabled: !enabled,
      })

      await page.goto('/account/settings')

      const notificationSwitch = page.getByRole('switch', { name: en.settings_comment_replies })
      const saveButton = page.getByRole('button', { name: en.common_save, exact: true })
      const resetButton = page.getByRole('button', { name: en.common_reset, exact: true })

      await expect(notificationSwitch).toBeChecked({ checked: !enabled })
      await notificationSwitch.click()

      await expect(notificationSwitch).toBeChecked({ checked: enabled })
      await expect(saveButton).toBeEnabled()
      await saveButton.click()

      await expect(page.getByText(en.success_settings_updated, { exact: true })).toBeVisible()
      await expect(notificationSwitch).toBeChecked({ checked: enabled })
      await expect(saveButton).toBeDisabled()
      await expect(resetButton).toBeHidden()

      await page.reload()

      await expect(notificationSwitch).toBeChecked({ checked: enabled })
      await expect(saveButton).toBeDisabled()
      await expect(resetButton).toBeHidden()
    })
  }
})
