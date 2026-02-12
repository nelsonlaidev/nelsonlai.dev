import { createId } from '@paralleldrive/cuid2'
import test, { expect } from '@playwright/test'

import { db } from '@/db'
import { messages } from '@/db/schemas'
import en from '@/i18n/messages/en.json' assert { type: 'json' }

import { TEST_UNIQUE_ID } from '../fixtures/auth'

test.describe('guestbook page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/guestbook')
  })

  test('submits a message', async ({ page }) => {
    const message = createId()

    await page.getByTestId('guestbook-textarea').fill(message)

    await page.getByTestId('guestbook-submit-button').click()
    await expect(page.getByTestId('guestbook-message-created-toast')).toContainText(en.success['message-created'])

    await expect(page.getByTestId('guestbook-messages-list').getByText(message)).toBeVisible()
  })

  test('deletes a message', async ({ page }) => {
    const id = createId()

    await db.insert(messages).values({
      id,
      body: 'Test message',
      userId: TEST_UNIQUE_ID,
    })

    const messageBlock = page.getByTestId(`message-${id}`)
    await expect(messageBlock).toBeVisible()
    await messageBlock.getByTestId('guestbook-delete-button').click()

    const deleteDialog = page.getByTestId('guestbook-dialog')
    await expect(deleteDialog).toBeVisible()
    await deleteDialog.getByTestId('guestbook-dialog-delete-button').click()

    await expect(messageBlock).toBeHidden()
    await expect(page.getByTestId('guestbook-message-deleted-toast')).toContainText(en.success['message-deleted'])
  })
})
