import { createId } from '@paralleldrive/cuid2'
import { inArray, sql } from 'drizzle-orm'

import { db } from '@/db'
import { messages } from '@/db/schemas'
import en from '@/i18n/messages/en.json' with { type: 'json' }

import { TEST_UNIQUE_ID } from '../fixtures/auth'
import { expect, test } from '../fixtures/test'

test.describe('guestbook page', () => {
  test.describe.configure({ mode: 'default' })

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

  test('loads every message once after timestamps are rounded to milliseconds', async ({ page }) => {
    const prefix = `pagination-${createId()}`
    const records = Array.from({ length: 23 }, (_, index) => ({
      // Reverse timestamp groups relative to IDs so ordering cannot rely on the ID alone.
      id: `${prefix}-${String((7 - Math.floor(index / 3)) * 3 + (index % 3)).padStart(2, '0')}`,
      body: `${prefix} message ${index}`,
      userId: TEST_UNIQUE_ID,
      // Let PostgreSQL round SQL inputs so the fixture exercises the stored column precision.
      createdAt: sql`'2040-01-01T00:00:00.123456Z'::timestamptz + ${Math.floor(index / 3)} * interval '1 millisecond'`,
    }))

    await db.insert(messages).values(records)

    try {
      const response = await page.request.post('/rpc/message/list', {
        data: {
          json: {
            limit: 1,
            cursor: { createdAt: '2040-01-01T00:00:00.126Z', id: records[9]?.id },
          },
        },
      })
      await expect(response).toBeOK()
      expect(await response.json()).toMatchObject({
        json: {
          messages: [{ id: records[8]?.id }],
          nextCursor: { createdAt: '2040-01-01T00:00:00.125Z', id: records[8]?.id },
        },
      })

      await page.goto('/guestbook')
      const loaded = page.getByTestId(new RegExp(`^message-${prefix}-`))
      await expect(loaded).toHaveCount(10)

      await expect(async () => {
        await loaded.last().scrollIntoViewIfNeeded()
        await page.mouse.wheel(0, 1000)
        await expect(loaded).toHaveCount(records.length, { timeout: 1000 })
      }).toPass({ timeout: 15_000 })

      const expectedIds = records.map(({ id }) => `message-${id}`).toReversed()
      expect(
        await loaded.evaluateAll((elements) => elements.map((element) => element.getAttribute('data-testid'))),
      ).toEqual(expectedIds)
    } finally {
      await db.delete(messages).where(
        inArray(
          messages.id,
          records.map(({ id }) => id),
        ),
      )
    }
  })
})
