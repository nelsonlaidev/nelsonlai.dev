import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { settings } from '@/db/schemas'
import en from '@/i18n/messages/en.json' with { type: 'json' }

import { TEST_UNIQUE_ID } from '../fixtures/auth'
import { expect, test } from '../fixtures/test'

test.describe('account settings', () => {
  // These tests update the same user's settings.
  test.describe.configure({ mode: 'default' })

  test.beforeEach(async () => {
    await db.delete(settings).where(eq(settings.userId, TEST_UNIQUE_ID))
  })

  test('loads default settings without allowing unchanged settings to be saved', async ({ page }) => {
    await page.goto('/account/settings')

    await expect(page.getByRole('switch', { name: en.settings['reply-notification'] })).toBeChecked()
    await expect(page.getByRole('button', { name: en.common.save, exact: true })).toBeDisabled()
    await expect(page.getByRole('button', { name: en.common.reset, exact: true })).toBeHidden()
  })

  test('resets unsaved notification changes', async ({ page }) => {
    await page.goto('/account/settings')

    const notificationSwitch = page.getByRole('switch', { name: en.settings['reply-notification'] })
    const saveButton = page.getByRole('button', { name: en.common.save, exact: true })
    const resetButton = page.getByRole('button', { name: en.common.reset, exact: true })

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
      await db.insert(settings).values({
        userId: TEST_UNIQUE_ID,
        replyNotificationsEnabled: !enabled,
      })

      await page.goto('/account/settings')

      const notificationSwitch = page.getByRole('switch', { name: en.settings['reply-notification'] })
      const saveButton = page.getByRole('button', { name: en.common.save, exact: true })
      const resetButton = page.getByRole('button', { name: en.common.reset, exact: true })

      await expect(notificationSwitch).toBeChecked({ checked: !enabled })
      await notificationSwitch.click()

      await expect(notificationSwitch).toBeChecked({ checked: enabled })
      await expect(saveButton).toBeEnabled()
      await saveButton.click()

      await expect(page.getByText(en.success['settings-updated'], { exact: true })).toBeVisible()
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
