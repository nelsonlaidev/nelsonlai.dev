import type { MessageListOutput } from '@/orpc/client'

import { createId } from '@paralleldrive/cuid2'
import { asc, eq, inArray, sql } from 'drizzle-orm'

import { db } from '@/db'
import { messages, users } from '@/db/schemas'
import en from '@/i18n/messages/en.json' with { type: 'json' }

import { TEST_UNIQUE_ID } from '../fixtures/auth'
import { expect, test } from '../fixtures/test'

test.describe('guestbook page', () => {
  // These tests insert and remove messages from the same public list.
  test.describe.configure({ mode: 'default' })

  test('submits a message', async ({ page }) => {
    const message = createId()

    await page.goto('/guestbook')

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

    await page.goto('/guestbook')

    const messageBlock = page.getByTestId(`message-${id}`)
    await expect(messageBlock).toBeVisible()
    await messageBlock.getByTestId('guestbook-delete-button').click()

    const deleteDialog = page.getByTestId('guestbook-dialog')
    await expect(deleteDialog).toBeVisible()
    await deleteDialog.getByTestId('guestbook-dialog-delete-button').click()

    await expect(messageBlock).toBeHidden()
    await expect(page.getByTestId('guestbook-message-deleted-toast')).toContainText(en.success['message-deleted'])
  })

  test("cannot delete another user's message through the UI or API", async ({ page }) => {
    const userId = createId()
    const id = createId()
    await db
      .insert(users)
      .values({ id: userId, name: 'Other Guestbook User', email: `${userId}@example.com`, emailVerified: false })

    try {
      await db.insert(messages).values({ id, body: `Other message ${id}`, userId })
      await page.goto('/guestbook')

      const message = page.getByTestId(`message-${id}`)
      await expect(message).toBeVisible()
      await expect(message.getByTestId('guestbook-delete-button')).toBeHidden()

      const response = await page.request.post('/rpc/message/delete', { data: { json: { id } } })
      expect(response.status()).toBe(404)
      expect(await response.json()).toMatchObject({ json: { code: 'NOT_FOUND' } })

      await page.reload()
      await expect(message).toBeVisible()
      expect(await db.query.messages.findFirst({ where: eq(messages.id, id) })).toMatchObject({ userId })
    } finally {
      await db.delete(users).where(eq(users.id, userId))
    }
  })

  test.describe('pagination boundaries', () => {
    for (const count of [0, 9, 10, 11]) {
      test.describe(`${count} messages`, () => {
        const limit = 10
        let records: Array<typeof messages.$inferInsert & { id: string }>
        let initialCursor: MessageListOutput['nextCursor']
        let expectedPages: Array<{ ids: string[]; nextCursor: MessageListOutput['nextCursor'] }>

        test.beforeEach(async () => {
          const prefix = `pagination-${createId()}`
          const oldest = await db.query.messages.findFirst({
            columns: { createdAt: true },
            orderBy: [asc(messages.createdAt)],
          })
          // Keep this cursor range before the public messages used by the other tests.
          const createdAt = new Date((oldest?.createdAt.getTime() ?? Date.now()) - 60_000)
          records = Array.from({ length: count }, (_, index) => ({
            id: `${prefix}-${String(index).padStart(2, '0')}`,
            body: `Pagination message ${index}`,
            userId: TEST_UNIQUE_ID,
            createdAt,
          }))
          initialCursor = { createdAt: new Date(createdAt.getTime() + 1).toISOString(), id: prefix }
          const ordered = records.toReversed()
          const visible = ordered.slice(0, limit)
          const lastVisible = visible.at(-1)
          expectedPages = [
            {
              ids: visible.map(({ id }) => id),
              nextCursor:
                count > limit && lastVisible ? { createdAt: createdAt.toISOString(), id: lastVisible.id } : undefined,
            },
          ]
          if (count > limit) {
            expectedPages.push({ ids: ordered.slice(limit).map(({ id }) => id), nextCursor: undefined })
          }

          if (records.length > 0) await db.insert(messages).values(records)
        })

        test.afterEach(async () => {
          if (records.length > 0) {
            await db.delete(messages).where(
              inArray(
                messages.id,
                records.map(({ id }) => id),
              ),
            )
          }
        })

        test('returns each page once and omits the cursor on the final page', async ({ request }) => {
          let cursor = initialCursor

          // Each request must use the cursor returned by the previous page.
          // oxlint-disable no-await-in-loop
          for (const expected of expectedPages) {
            const response = await request.post('/rpc/message/list', { data: { json: { limit, cursor } } })
            await expect(response).toBeOK()

            const body = (await response.json()) as { json: MessageListOutput }
            expect(body.json.messages).toMatchObject(expected.ids.map((id) => ({ id })))
            expect(body.json.messages).toHaveLength(expected.ids.length)
            expect(body.json.nextCursor).toEqual(expected.nextCursor)
            cursor = body.json.nextCursor
          }
          // oxlint-enable no-await-in-loop
        })
      })
    }
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
