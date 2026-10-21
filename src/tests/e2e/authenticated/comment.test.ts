import { createId } from '@paralleldrive/cuid2'
import { eq, inArray, sql } from 'drizzle-orm'

import { db } from '@/db'
import { comments } from '@/db/schemas'
import en from '@/i18n/messages/en.json' with { type: 'json' }

import { TEST_UNIQUE_ID } from '../fixtures/auth'
import {
  COMMENT_DELETE_AND_LIKE_POST_SLUG,
  COMMENT_DELETE_REPLY_POST_SLUG,
  COMMENT_REPLY_POST_SLUG,
  COMMENT_SUBMIT_AND_VIEW_POST_SLUG,
} from '../fixtures/posts'
import { expect, test } from '../fixtures/test'
import { getNumberFlow } from '../utils/number-flow'

async function getCount(locator: Parameters<typeof getNumberFlow>[0]) {
  return Number.parseInt(String(await getNumberFlow(locator)), 10)
}

test.describe('comment page', () => {
  test.describe.configure({ mode: 'default' })

  test('submits a comment', async ({ page }) => {
    const commentText = `comment-${createId()}`

    await page.goto(`/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}`)

    const initialCommentCount = await getCount(page.getByTestId('comment-count'))

    await page.getByTestId('comment-textarea-post').fill(commentText)
    await page.getByTestId('comment-submit-button').click()

    await expect(page.getByTestId('comments-list').getByText(commentText)).toBeVisible()
    await expect(page.getByTestId('comment-posted-toast')).toContainText(en.success['comment-posted'])

    // Comment count should be updated in the blog header and comment header
    expect(await getCount(page.getByTestId('comment-count'))).toBe(initialCommentCount + 1)
    expect(await getCount(page.getByTestId('blog-comment-count'))).toBe(initialCommentCount + 1)
  })

  test('deletes a comment', async ({ page }) => {
    const commentId = createId()

    await db.insert(comments).values({
      id: commentId,
      body: 'Test Comment',
      postId: COMMENT_DELETE_AND_LIKE_POST_SLUG,
      userId: TEST_UNIQUE_ID,
    })

    await page.goto(`/blog/${COMMENT_DELETE_AND_LIKE_POST_SLUG}`)

    const commentBlock = page.getByTestId(`comment-${commentId}`)
    await expect(commentBlock).toBeVisible()
    const commentCountWithInsertedComment = await getCount(page.getByTestId('comment-count'))
    await commentBlock.getByTestId('comment-menu-button').click()

    await page.getByTestId('comment-delete-button').click()

    const deleteDialog = page.getByTestId('comment-dialog')
    await expect(deleteDialog).toBeVisible()
    await deleteDialog.getByTestId('comment-dialog-delete-button').click()

    await expect(commentBlock).toBeHidden()
    await expect(page.getByTestId('comment-deleted-toast')).toContainText(en.success['comment-deleted'])

    // Comment count should be updated in the blog header and comment header
    expect(await getCount(page.getByTestId('comment-count'))).toBe(commentCountWithInsertedComment - 1)
    expect(await getCount(page.getByTestId('blog-comment-count'))).toBe(commentCountWithInsertedComment - 1)
  })

  test('replies to a comment', async ({ page }) => {
    const parentId = createId()
    const replyText = `reply-${createId()}`

    await db.insert(comments).values({
      id: parentId,
      body: 'Parent Comment',
      postId: COMMENT_REPLY_POST_SLUG,
      userId: TEST_UNIQUE_ID,
    })

    await page.goto(`/blog/${COMMENT_REPLY_POST_SLUG}`)

    const parentCommentBlock = page.getByTestId(`comment-${parentId}`)
    const commentCountBeforeReply = await getCount(page.getByTestId('comment-count'))

    await parentCommentBlock.getByTestId('comment-reply-button').click()

    await page.getByTestId('comment-textarea-reply').fill(replyText)
    await page.getByTestId('comment-submit-reply-button').click()
    await expect(page.getByTestId('comment-reply-posted-toast')).toContainText(en.success['reply-posted'])

    const expandButton = parentCommentBlock.getByTestId('comment-replies-expand-button')
    await expect(expandButton.getByTestId('comment-reply-count')).toContainText('1')
    await expandButton.click()

    await expect(page.getByTestId('comments-list').getByText(replyText)).toBeVisible()

    // Reply count should be updated in the blog header and comment header
    expect(await getCount(page.getByTestId('comment-count'))).toBe(commentCountBeforeReply + 1)
    expect(await getNumberFlow(page.getByTestId('reply-count'))).toBe('1 reply')
  })

  test('deletes a reply', async ({ page }) => {
    const parentId = createId()
    const replyId = createId()

    await db.insert(comments).values({
      id: parentId,
      body: 'Parent Comment',
      postId: COMMENT_DELETE_REPLY_POST_SLUG,
      userId: TEST_UNIQUE_ID,
    })

    await db.insert(comments).values({
      id: replyId,
      body: 'Reply comment',
      postId: COMMENT_DELETE_REPLY_POST_SLUG,
      userId: TEST_UNIQUE_ID,
      parentId,
    })

    await page.goto(`/blog/${COMMENT_DELETE_REPLY_POST_SLUG}`)

    const parentCommentBlock = page.getByTestId(`comment-${parentId}`)
    await expect(parentCommentBlock).toBeVisible()
    const commentCountWithInsertedReply = await getCount(page.getByTestId('comment-count'))

    const expandButton = parentCommentBlock.getByTestId('comment-replies-expand-button')
    await expandButton.click()

    const replyCommentBlock = page.getByTestId(`comment-${replyId}`)
    await expect(replyCommentBlock).toBeVisible()
    await replyCommentBlock.getByTestId('comment-menu-button').click()

    await page.getByTestId('comment-delete-button').click()

    const deleteDialog = page.getByTestId('comment-dialog')
    await expect(deleteDialog).toBeVisible()
    await deleteDialog.getByTestId('comment-dialog-delete-button').click()

    await expect(replyCommentBlock).toBeHidden()
    await expect(page.getByTestId('comment-deleted-toast')).toContainText(en.success['comment-deleted'])

    // Reply count should be updated in the comment header
    expect(await getCount(page.getByTestId('comment-count'))).toBe(commentCountWithInsertedReply - 1)
    expect(await getNumberFlow(page.getByTestId('reply-count'))).toBe('0 replies')
  })

  test.describe('pagination and sorting', () => {
    let prefix: string
    let parentId: string
    let records: Array<typeof comments.$inferInsert & { id: string }>

    test.beforeEach(async () => {
      prefix = `pagination-${createId()}`
      parentId = createId()
      await db.insert(comments).values({
        id: parentId,
        body: 'Pagination parent',
        postId: COMMENT_SUBMIT_AND_VIEW_POST_SLUG,
        userId: TEST_UNIQUE_ID,
      })
      records = ['comment', 'reply'].flatMap((type) =>
        Array.from({ length: 23 }, (_, index) => ({
          // Reverse timestamp groups relative to IDs so ordering cannot rely on the ID alone.
          id: `${prefix}-${type}-${String((7 - Math.floor(index / 3)) * 3 + (index % 3)).padStart(2, '0')}`,
          body: `${prefix} ${type} ${index}`,
          postId: COMMENT_SUBMIT_AND_VIEW_POST_SLUG,
          userId: TEST_UNIQUE_ID,
          parentId: type === 'reply' ? parentId : null,
        })),
      )
      await db.insert(comments).values(
        records.map((record, index) => ({
          ...record,
          // Let PostgreSQL round SQL inputs so the fixture exercises the stored column precision.
          createdAt: sql`'2040-01-01T00:00:00.123456Z'::timestamptz + ${Math.floor((index % 23) / 3)} * interval '1 millisecond'`,
        })),
      )
    })

    test.afterEach(async () => {
      await db.delete(comments).where(
        inArray(
          comments.id,
          records.map(({ id }) => id),
        ),
      )
      await db.delete(comments).where(eq(comments.id, parentId))
    })

    for (const sort of ['newest', 'oldest'] as const) {
      test(`loads every top-level comment once in ${sort} order after timestamps are rounded to milliseconds`, async ({
        page,
      }) => {
        const commentRecords = records.filter(({ parentId }) => parentId === null)
        const boundary = {
          newest: {
            cursorId: commentRecords[9]?.id,
            nextId: commentRecords[8]?.id,
            createdAt: '2040-01-01T00:00:00.125Z',
          },
          oldest: {
            cursorId: commentRecords[11]?.id,
            nextId: commentRecords[12]?.id,
            createdAt: '2040-01-01T00:00:00.127Z',
          },
        }[sort]
        const response = await page.request.post('/rpc/comment/list', {
          data: {
            json: {
              slug: COMMENT_SUBMIT_AND_VIEW_POST_SLUG,
              sort,
              type: 'comments',
              limit: 1,
              cursor: { createdAt: '2040-01-01T00:00:00.126Z', id: boundary.cursorId },
            },
          },
        })
        await expect(response).toBeOK()
        expect(await response.json()).toMatchObject({
          json: {
            comments: [{ id: boundary.nextId }],
            nextCursor: { createdAt: boundary.createdAt, id: boundary.nextId },
          },
        })

        await page.goto(`/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}`)
        await page.getByRole('button', { name: en.blog.comments['sort-by'] }).click()
        await page.getByRole('menuitemradio', { name: en.blog.comments[sort], exact: true }).click()

        const loaded = page.getByTestId(new RegExp(`^comment-${prefix}-comment-`))
        const expected = records.filter(({ parentId }) => parentId === null).map(({ id }) => `comment-${id}`)
        const expectedBySort = { newest: expected.toReversed(), oldest: expected }

        await expect(async () => {
          await page
            .getByTestId('comments-list')
            .getByTestId(/^comment-/)
            .last()
            .scrollIntoViewIfNeeded()
          await page.mouse.wheel(0, 1000)
          expect(
            await loaded.evaluateAll((elements) => elements.map((element) => element.getAttribute('data-testid'))),
          ).toEqual(expectedBySort[sort])
        }).toPass({ timeout: 15_000 })
      })
    }

    test('loads every reply once in oldest order after timestamps are rounded to milliseconds', async ({ page }) => {
      const replyRecords = records.filter((record) => record.parentId === parentId)
      const response = await page.request.post('/rpc/comment/list', {
        data: {
          json: {
            slug: COMMENT_SUBMIT_AND_VIEW_POST_SLUG,
            sort: 'oldest',
            type: 'replies',
            parentId,
            limit: 1,
            cursor: { createdAt: '2040-01-01T00:00:00.123Z', id: replyRecords[0]?.id },
          },
        },
      })
      await expect(response).toBeOK()
      expect(await response.json()).toMatchObject({
        json: {
          comments: [{ id: replyRecords[1]?.id }],
          nextCursor: { createdAt: '2040-01-01T00:00:00.123Z', id: replyRecords[1]?.id },
        },
      })

      await page.goto(`/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}?comment=${parentId}`)
      const loaded = page.getByTestId(new RegExp(`^comment-${prefix}-reply-`))
      await expect(loaded).toHaveCount(10)
      const expected = records.filter((record) => record.parentId === parentId).map(({ id }) => `comment-${id}`)

      await expect(async () => {
        await loaded.last().scrollIntoViewIfNeeded()
        await page.mouse.wheel(0, 1000)
        expect(
          await loaded.evaluateAll((elements) => elements.map((element) => element.getAttribute('data-testid'))),
        ).toEqual(expected)
      }).toPass({ timeout: 15_000 })
    })
  })
})
