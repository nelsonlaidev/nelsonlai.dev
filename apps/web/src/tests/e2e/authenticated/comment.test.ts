import type { ListCommentsInputSchema, ListCommentsOutputSchema } from '@repo/api/schema/comments'
import type * as z from 'zod'

import en from '@messages/en.json' with { type: 'json' }
import zhTW from '@messages/zh-TW.json' with { type: 'json' }
import { createId } from '@paralleldrive/cuid2'
import { users } from '@repo/db/schema/auth'
import { comments } from '@repo/db/schema/comments'
import { posts } from '@repo/db/schema/posts'
import { createRange } from '@repo/utils'
import { eq, inArray, sql } from 'drizzle-orm'

import { db } from '@/lib/db'

import { TEST_UNIQUE_ID } from '../fixtures/auth'
import {
  COMMENT_DELETE_AND_LIKE_POST_SLUG,
  COMMENT_DELETE_REPLY_POST_SLUG,
  COMMENT_REPLY_POST_SLUG,
  COMMENT_SUBMIT_AND_VIEW_POST_SLUG,
} from '../fixtures/posts'
import { expect, test } from '../fixtures/test'
import { getNumberFlow } from '../utils/number-flow'

type CommentListInput = z.infer<typeof ListCommentsInputSchema>
type CommentListOutput = z.infer<typeof ListCommentsOutputSchema>

async function getCount(locator: Parameters<typeof getNumberFlow>[0]) {
  return Number.parseInt((await getNumberFlow(locator)) ?? '', 10)
}

test.describe('comment page', () => {
  // Comment mutations share article counts across these tests.
  test.describe.configure({ mode: 'default' })

  test('submits a comment', async ({ page }) => {
    const commentText = `comment-${createId()}`

    await page.goto(`/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}`)

    const initialCommentCount = await getCount(page.getByTestId('comment-count'))

    await page.getByRole('textbox', { name: en.blog_comments_placeholder }).fill(commentText)
    await page.getByRole('button', { name: en.blog_comments_send_comment, exact: true }).click()

    await expect(page.locator('#comments').getByText(commentText)).toBeVisible()
    await expect(page.getByText(en.success_comment_posted, { exact: true })).toContainText(en.success_comment_posted)

    // Comment count should be updated in the blog header and comment header
    expect(await getCount(page.getByTestId('comment-count'))).toBe(initialCommentCount + 1)
    expect(await getCount(page.getByTestId('blog-comment-count'))).toBe(initialCommentCount + 1)
  })

  test('deletes a comment', async ({ page }) => {
    const commentId = createId()

    await db.insert(comments).values({
      id: commentId,
      body: 'Test Comment',
      postSlug: COMMENT_DELETE_AND_LIKE_POST_SLUG,
      userId: TEST_UNIQUE_ID,
    })

    await page.goto(`/blog/${COMMENT_DELETE_AND_LIKE_POST_SLUG}`)

    const commentBlock = page.getByTestId(`comment-${commentId}`)
    await expect(commentBlock).toBeVisible()
    const commentCountWithInsertedComment = await getCount(page.getByTestId('comment-count'))
    await commentBlock.getByRole('button', { name: en.blog_comments_open_menu, exact: true }).click()

    await page.getByRole('menuitem', { name: en.common_delete, exact: true }).click()

    const deleteDialog = page.getByRole('alertdialog')
    await expect(deleteDialog).toBeVisible()
    await deleteDialog.getByRole('button', { name: en.common_delete, exact: true }).click()

    await expect(commentBlock).toBeHidden()
    await expect(page.getByText(en.success_comment_deleted, { exact: true })).toContainText(en.success_comment_deleted)

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
      postSlug: COMMENT_REPLY_POST_SLUG,
      userId: TEST_UNIQUE_ID,
    })

    await page.goto(`/blog/${COMMENT_REPLY_POST_SLUG}`)

    const parentCommentBlock = page.getByTestId(`comment-${parentId}`)
    const commentCountBeforeReply = await getCount(page.getByTestId('comment-count'))

    await parentCommentBlock.getByRole('button', { name: en.blog_comments_reply, exact: true }).click()

    await page.getByRole('textbox', { name: en.blog_comments_reply_to_comment }).fill(replyText)
    await page.getByRole('button', { name: en.blog_comments_reply, exact: true }).click()
    await expect(page.getByText(en.success_reply_posted, { exact: true })).toContainText(en.success_reply_posted)

    const expandButton = parentCommentBlock.locator('button[aria-expanded]:not([aria-haspopup])')
    await expect(expandButton.getByTestId('comment-reply-count')).toContainText('1')
    await expandButton.click()

    await expect(page.locator('#comments').getByText(replyText)).toBeVisible()

    // Reply count should be updated in the blog header and comment header
    expect(await getCount(page.getByTestId('comment-count'))).toBe(commentCountBeforeReply + 1)
    expect(await getNumberFlow(page.getByTestId('reply-count'))).toBe('1')
  })

  test('deletes a reply', async ({ page }) => {
    const parentId = createId()
    const replyId = createId()

    await db.insert(comments).values({
      id: parentId,
      body: 'Parent Comment',
      postSlug: COMMENT_DELETE_REPLY_POST_SLUG,
      userId: TEST_UNIQUE_ID,
    })

    await db.insert(comments).values({
      id: replyId,
      body: 'Reply comment',
      postSlug: COMMENT_DELETE_REPLY_POST_SLUG,
      userId: TEST_UNIQUE_ID,
      parentId,
    })

    await page.goto(`/blog/${COMMENT_DELETE_REPLY_POST_SLUG}`)

    const parentCommentBlock = page.getByTestId(`comment-${parentId}`)
    await expect(parentCommentBlock).toBeVisible()
    const commentCountWithInsertedReply = await getCount(page.getByTestId('comment-count'))

    const expandButton = parentCommentBlock.locator('button[aria-expanded]:not([aria-haspopup])')
    await expandButton.click()

    const replyCommentBlock = page.getByTestId(`comment-${replyId}`)
    await expect(replyCommentBlock).toBeVisible()
    await replyCommentBlock.getByRole('button', { name: en.blog_comments_open_menu, exact: true }).click()

    await page.getByRole('menuitem', { name: en.common_delete, exact: true }).click()

    const deleteDialog = page.getByRole('alertdialog')
    await expect(deleteDialog).toBeVisible()
    await deleteDialog.getByRole('button', { name: en.common_delete, exact: true }).click()

    await expect(replyCommentBlock).toBeHidden()
    await expect(page.getByText(en.success_comment_deleted, { exact: true })).toContainText(en.success_comment_deleted)

    // Reply count should be updated in the comment header
    expect(await getCount(page.getByTestId('comment-count'))).toBe(commentCountWithInsertedReply - 1)
    expect(await getNumberFlow(page.getByTestId('reply-count'))).toBe('0')
  })

  for (const type of ['comment', 'reply'] as const) {
    test(`cancels deleting a ${type}`, async ({ page }) => {
      const commentIds = { comment: createId(), reply: createId() }
      const parentId = commentIds.comment
      const commentId = commentIds[type]
      const commentText = `cancel-delete-${commentId}`

      await db.insert(comments).values({
        id: parentId,
        body: `cancel-delete-${parentId}`,
        postSlug: COMMENT_DELETE_AND_LIKE_POST_SLUG,
        userId: TEST_UNIQUE_ID,
      })
      await db.insert(comments).values({
        id: commentIds.reply,
        body: `cancel-delete-${commentIds.reply}`,
        postSlug: COMMENT_DELETE_AND_LIKE_POST_SLUG,
        userId: TEST_UNIQUE_ID,
        parentId,
      })

      await page.goto(`/blog/${COMMENT_DELETE_AND_LIKE_POST_SLUG}?comment=${parentId}`)

      const commentBlock = page.getByTestId(`comment-${commentId}`)
      await expect(commentBlock.getByText(commentText, { exact: true })).toBeVisible()
      const initialCommentCount = await getCount(page.getByTestId('comment-count'))
      const initialTopLevelCount = await getCount(page.getByTestId('blog-comment-count'))
      const initialReplyCount = await getCount(page.getByTestId('reply-count'))

      await commentBlock.getByRole('button', { name: en.blog_comments_open_menu, exact: true }).click()
      await page.getByRole('menuitem', { name: en.common_delete, exact: true }).click()

      const deleteDialog = page.getByRole('alertdialog')
      await expect(deleteDialog).toBeVisible()
      await deleteDialog.getByRole('button', { name: en.common_cancel, exact: true }).click()

      await expect(deleteDialog).toBeHidden()
      await expect(commentBlock.getByText(commentText, { exact: true })).toBeVisible()
      await expect(page.getByText(en.success_comment_deleted, { exact: true })).toBeHidden()
      expect(await getCount(page.getByTestId('comment-count'))).toBe(initialCommentCount)
      expect(await getCount(page.getByTestId('blog-comment-count'))).toBe(initialTopLevelCount)
      expect(await getCount(page.getByTestId('reply-count'))).toBe(initialReplyCount)

      await page.reload()

      await expect(commentBlock.getByText(commentText, { exact: true })).toBeVisible()
      expect(await getCount(page.getByTestId('comment-count'))).toBe(initialCommentCount)
      expect(await getCount(page.getByTestId('blog-comment-count'))).toBe(initialTopLevelCount)
      expect(await getCount(page.getByTestId('reply-count'))).toBe(initialReplyCount)
    })
  }

  test("cannot delete another user's comment through the menu or API", async ({ page }) => {
    const otherUserId = createId()
    const commentId = createId()
    const commentText = `other-user-comment-${commentId}`

    await db.insert(users).values({
      id: otherUserId,
      name: 'Other Test User',
      email: `${otherUserId}@example.com`,
      emailVerified: false,
    })

    try {
      await db.insert(comments).values({
        id: commentId,
        body: commentText,
        postSlug: COMMENT_DELETE_AND_LIKE_POST_SLUG,
        userId: otherUserId,
      })

      const sessionResponse = await page.request.get('/api/auth/get-session')
      await expect(sessionResponse).toBeOK()
      expect(await sessionResponse.json()).toMatchObject({ user: { id: TEST_UNIQUE_ID } })

      await page.goto(`/blog/${COMMENT_DELETE_AND_LIKE_POST_SLUG}?comment=${commentId}`)

      const commentBlock = page.getByTestId(`comment-${commentId}`)
      await expect(commentBlock.getByText(commentText, { exact: true })).toBeVisible()
      const initialCommentCount = await getCount(page.getByTestId('comment-count'))
      const initialTopLevelCount = await getCount(page.getByTestId('blog-comment-count'))

      await commentBlock.getByRole('button', { name: en.blog_comments_open_menu, exact: true }).click()
      await expect(page.getByRole('menuitem', { name: en.blog_comments_copy_link })).toBeVisible()
      await expect(page.getByRole('menuitem', { name: en.common_delete, exact: true })).toBeHidden()

      const deleteResponse = await page.request.post('/api/rpc/comments/delete', {
        data: { json: { id: commentId } },
      })

      expect(deleteResponse.status()).toBe(403)
      expect(await deleteResponse.json()).toMatchObject({ json: { code: 'FORBIDDEN' } })

      await db.delete(users).where(eq(users.id, otherUserId))
      await page.reload()
      await expect(commentBlock.getByText(en.common_labels_deleted_user, { exact: true })).toBeVisible()

      await expect(commentBlock.getByText(commentText, { exact: true })).toBeVisible()
      expect(await getCount(page.getByTestId('comment-count'))).toBe(initialCommentCount)
      expect(await getCount(page.getByTestId('blog-comment-count'))).toBe(initialTopLevelCount)
    } finally {
      await db.delete(comments).where(eq(comments.id, commentId))
      await db.delete(users).where(eq(users.id, otherUserId))
    }
  })

  test('preserves replies when their parent comment is deleted', async ({ page }) => {
    const parentId = createId()
    const replyId = createId()
    const parentText = `parent-${parentId}`
    const replyText = `reply-${replyId}`

    await db.insert(comments).values({
      id: parentId,
      body: parentText,
      postSlug: COMMENT_DELETE_AND_LIKE_POST_SLUG,
      userId: TEST_UNIQUE_ID,
    })
    await db.insert(comments).values({
      id: replyId,
      body: replyText,
      postSlug: COMMENT_DELETE_AND_LIKE_POST_SLUG,
      userId: TEST_UNIQUE_ID,
      parentId,
    })

    await page.goto(`/blog/${COMMENT_DELETE_AND_LIKE_POST_SLUG}?comment=${parentId}`)

    const parentBlock = page.getByTestId(`comment-${parentId}`)
    const replyBlock = page.getByTestId(`comment-${replyId}`)
    await expect(parentBlock.getByText(parentText, { exact: true })).toBeVisible()
    await expect(replyBlock.getByText(replyText, { exact: true })).toBeVisible()
    const initialCommentCount = await getCount(page.getByTestId('comment-count'))
    const initialTopLevelCount = await getCount(page.getByTestId('blog-comment-count'))
    const initialReplyCount = await getCount(page.getByTestId('reply-count'))

    await parentBlock.getByRole('button', { name: en.blog_comments_open_menu, exact: true }).click()
    await page.getByRole('menuitem', { name: en.common_delete, exact: true }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: en.common_delete, exact: true }).click()

    await expect(page.getByText(en.success_comment_deleted, { exact: true })).toContainText(en.success_comment_deleted)
    await expect(parentBlock.getByText(en.blog_comments_this_comment_has_been_deleted, { exact: true })).toBeVisible()
    await expect(parentBlock.getByText(parentText, { exact: true })).toBeHidden()
    await expect(replyBlock.getByText(replyText, { exact: true })).toBeVisible()
    expect(await getCount(page.getByTestId('comment-count'))).toBe(initialCommentCount)
    expect(await getCount(page.getByTestId('blog-comment-count'))).toBe(initialTopLevelCount)
    expect(await getCount(page.getByTestId('reply-count'))).toBe(initialReplyCount)

    await page.reload()

    await expect(parentBlock.getByText(en.blog_comments_this_comment_has_been_deleted, { exact: true })).toBeVisible()
    await expect(parentBlock.getByText(parentText, { exact: true })).toBeHidden()
    await expect(replyBlock.getByText(replyText, { exact: true })).toBeVisible()
    await parentBlock.getByRole('button', { name: en.blog_comments_open_menu, exact: true }).click()
    await expect(page.getByRole('menuitem', { name: en.blog_comments_copy_link })).toBeVisible()
    await expect(page.getByRole('menuitem', { name: en.common_delete, exact: true })).toBeHidden()
  })

  test('removes a deleted parent when its last reply is deleted', async ({ page }) => {
    const parentId = createId()
    const replyId = createId()

    await db.insert(comments).values({
      id: parentId,
      body: 'Deleted Parent Comment',
      postSlug: COMMENT_DELETE_AND_LIKE_POST_SLUG,
      userId: TEST_UNIQUE_ID,
      isDeleted: true,
    })
    await db.insert(comments).values({
      id: replyId,
      body: 'Last Reply',
      postSlug: COMMENT_DELETE_AND_LIKE_POST_SLUG,
      userId: TEST_UNIQUE_ID,
      parentId,
    })

    await page.goto(`/blog/${COMMENT_DELETE_AND_LIKE_POST_SLUG}?comment=${parentId}`)

    const parentBlock = page.getByTestId(`comment-${parentId}`)
    const replyBlock = page.getByTestId(`comment-${replyId}`)
    await expect(parentBlock.getByText(en.blog_comments_this_comment_has_been_deleted, { exact: true })).toBeVisible()
    await expect(replyBlock).toBeVisible()
    const initialCommentCount = await getCount(page.getByTestId('comment-count'))
    const initialTopLevelCount = await getCount(page.getByTestId('blog-comment-count'))
    const initialReplyCount = await getCount(page.getByTestId('reply-count'))

    await replyBlock.getByRole('button', { name: en.blog_comments_open_menu, exact: true }).click()
    await page.getByRole('menuitem', { name: en.common_delete, exact: true }).click()
    await page.getByRole('alertdialog').getByRole('button', { name: en.common_delete, exact: true }).click()

    await expect(page.getByText(en.success_comment_deleted, { exact: true })).toContainText(en.success_comment_deleted)
    await expect(parentBlock).toBeHidden()
    await expect(replyBlock).toBeHidden()
    expect(await getCount(page.getByTestId('comment-count'))).toBe(initialCommentCount - 2)
    expect(await getCount(page.getByTestId('blog-comment-count'))).toBe(initialTopLevelCount - 1)
    expect(await getCount(page.getByTestId('reply-count'))).toBe(initialReplyCount - 1)

    const commentsResponse = page.waitForResponse(
      (response) => response.url().includes('/api/rpc/comments/list') && response.ok(),
    )
    await page.reload()
    await commentsResponse

    await expect(page.locator('#comments')).toBeVisible()
    await expect(parentBlock).toBeHidden()
    await expect(replyBlock).toBeHidden()
    expect(await getCount(page.getByTestId('comment-count'))).toBe(initialCommentCount - 2)
    expect(await getCount(page.getByTestId('blog-comment-count'))).toBe(initialTopLevelCount - 1)
    expect(await getCount(page.getByTestId('reply-count'))).toBe(initialReplyCount - 1)
  })

  test.describe('voting', () => {
    let parentId: string
    let replyId: string

    test.beforeEach(async () => {
      parentId = createId()
      replyId = createId()

      await db.insert(comments).values({
        id: parentId,
        body: 'Vote parent',
        postSlug: COMMENT_SUBMIT_AND_VIEW_POST_SLUG,
        userId: TEST_UNIQUE_ID,
      })
      await db.insert(comments).values({
        id: replyId,
        parentId,
        body: 'Vote reply',
        postSlug: COMMENT_SUBMIT_AND_VIEW_POST_SLUG,
        userId: TEST_UNIQUE_ID,
      })
    })

    test.afterEach(async () => {
      await db.delete(comments).where(eq(comments.id, replyId))
      await db.delete(comments).where(eq(comments.id, parentId))
    })

    for (const type of ['comment', 'reply'] as const) {
      test(`persists liking, disliking, and removing a vote on a ${type}`, async ({ page }) => {
        const id = { comment: parentId, reply: replyId }[type]
        await page.goto(`/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}?comment=${parentId}`)

        const comment = page.getByTestId(`comment-${id}`)
        const like = comment.getByRole('button', { name: en.common_like, exact: true })
        const dislike = comment.getByRole('button', { name: en.blog_comments_dislike, exact: true })

        // Each transition depends on the vote saved by the previous step.
        // oxlint-disable no-await-in-loop
        for (const state of [
          { action: like, liked: true, likes: '1', dislikes: '0' },
          { action: dislike, liked: false, likes: '0', dislikes: '1' },
          { action: dislike, liked: null, likes: '0', dislikes: '0' },
        ]) {
          const saved = page.waitForResponse(
            (response) => response.url().includes('/api/rpc/comments/vote') && response.ok(),
          )
          await state.action.click()
          await saved

          await expect(like).toHaveAttribute('aria-pressed', String(state.liked === true))
          await expect(dislike).toHaveAttribute('aria-pressed', String(state.liked === false))
          expect(await getNumberFlow(like.locator('number-flow-react'))).toBe(state.likes)
          expect(await getNumberFlow(dislike.locator('number-flow-react'))).toBe(state.dislikes)

          const vote = await db.query.commentVotes.findFirst({
            where: { commentId: id, userId: TEST_UNIQUE_ID },
          })
          expect(vote?.isLike ?? null).toBe(state.liked)

          await page.reload()

          await expect(like).toHaveAttribute('aria-pressed', String(state.liked === true))
          await expect(dislike).toHaveAttribute('aria-pressed', String(state.liked === false))
          expect(await getNumberFlow(like.locator('number-flow-react'))).toBe(state.likes)
          expect(await getNumberFlow(dislike.locator('number-flow-react'))).toBe(state.dislikes)
        }
        // oxlint-enable no-await-in-loop
      })

      test(`rolls back an optimistic vote on a ${type} when saving fails`, async ({ page }) => {
        const id = { comment: parentId, reply: replyId }[type]
        await page.goto(`/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}?comment=${parentId}`)
        const like = page.getByTestId(`comment-${id}`).getByRole('button', { name: en.common_like, exact: true })
        const pending = Promise.withResolvers<boolean>()
        const failed = page.waitForResponse(
          (response) => response.url().includes('/api/rpc/comments/vote') && response.status() === 500,
        )

        await page.route('**/api/rpc/comments/vote', async (route) => {
          await pending.promise
          await route.fulfill({
            status: 500,
            json: { json: { defined: false, code: 'INTERNAL_SERVER_ERROR', status: 500, message: 'Vote failed' } },
          })
        })

        try {
          await like.click()
          await expect(like).toHaveAttribute('aria-pressed', 'true')
          expect(await getNumberFlow(like.locator('number-flow-react'))).toBe('1')
        } finally {
          pending.resolve(true)
        }

        await failed
        await expect(like).toHaveAttribute('aria-pressed', 'false')
        expect(await getNumberFlow(like.locator('number-flow-react'))).toBe('0')
        expect(
          await db.query.commentVotes.findFirst({ where: { commentId: id, userId: TEST_UNIQUE_ID } }),
        ).toBeUndefined()

        await page.reload()
        await expect(like).toHaveAttribute('aria-pressed', 'false')
        expect(await getNumberFlow(like.locator('number-flow-react'))).toBe('0')
      })
    }
  })

  test.describe('pagination boundaries', () => {
    for (const sort of ['newest', 'oldest'] as const) {
      for (const { count, highlighted, limit } of [
        { count: 0, highlighted: false, limit: 10 },
        { count: 9, highlighted: false, limit: 10 },
        { count: 10, highlighted: false, limit: 10 },
        { count: 11, highlighted: false, limit: 10 },
        { count: 0, highlighted: true, limit: 1 },
        { count: 9, highlighted: true, limit: 10 },
        { count: 10, highlighted: true, limit: 10 },
        { count: 11, highlighted: true, limit: 10 },
      ]) {
        test.describe(`${count} ordinary comments in ${sort} order with highlighted=${highlighted} and limit=${limit}`, () => {
          let slug: string
          let input: CommentListInput
          let expectedPages: Array<{
            ids: string[]
            nextCursor: CommentListOutput['nextCursor']
          }>

          test.beforeEach(async () => {
            slug = `pagination-${createId()}`
            const createdAt = new Date('2040-01-01T00:00:00.123Z')
            const ordinary = createRange(count).map((index) => ({
              id: `${slug}-${String(index).padStart(2, '0')}`,
              body: `Pagination comment ${index}`,
              postSlug: slug,
              userId: TEST_UNIQUE_ID,
              createdAt,
            }))

            const highlightedComment = highlighted
              ? {
                  id: `${slug}-highlighted`,
                  body: 'Highlighted pagination comment',
                  postSlug: slug,
                  userId: TEST_UNIQUE_ID,
                  createdAt: new Date('2039-01-01T00:00:00.000Z'),
                }
              : undefined
            const records = highlightedComment ? [...ordinary, highlightedComment] : ordinary

            const ordered = sort === 'newest' ? ordinary.toReversed() : ordinary
            const visible = ordered.slice(0, limit)
            const lastVisible = visible.at(-1)
            const expected = highlightedComment ? [highlightedComment, ...visible] : visible

            input = { slug, sort, limit, highlightedCommentId: highlightedComment?.id }
            expectedPages = [
              {
                ids: expected.map(({ id }) => id),
                nextCursor:
                  count > limit && lastVisible ? { createdAt: createdAt.toISOString(), id: lastVisible.id } : undefined,
              },
            ]
            if (count > limit) {
              expectedPages.push({ ids: ordered.slice(limit).map(({ id }) => id), nextCursor: undefined })
            }

            await db.insert(posts).values({ slug })
            if (records.length > 0) await db.insert(comments).values(records)
          })

          test.afterEach(async () => {
            await db.delete(posts).where(eq(posts.slug, slug))
          })

          test('returns each page once and omits the cursor on the final page', async ({ request }) => {
            let cursor: CommentListInput['cursor']

            // Each request must use the cursor returned by the previous page.
            // oxlint-disable no-await-in-loop
            for (const expected of expectedPages) {
              const response = await request.post('/api/rpc/comments/list', { data: { json: { ...input, cursor } } })
              await expect(response).toBeOK()

              const body = (await response.json()) as {
                json: CommentListOutput
              }

              expect(body.json.comments).toMatchObject(expected.ids.map((id) => ({ id })))
              expect(body.json.comments).toHaveLength(expected.ids.length)
              expect(body.json.nextCursor).toEqual(expected.nextCursor)

              cursor = body.json.nextCursor
            }
            // oxlint-enable no-await-in-loop
          })
        })
      }
    }
  })

  test.describe('pagination and sorting', () => {
    let prefix: string
    let parentId: string
    let records: Array<
      typeof comments.$inferInsert & {
        id: string
      }
    >

    test.beforeEach(async () => {
      prefix = `pagination-${createId()}`
      parentId = createId()

      await db.insert(comments).values({
        id: parentId,
        body: 'Pagination parent',
        postSlug: COMMENT_SUBMIT_AND_VIEW_POST_SLUG,
        userId: TEST_UNIQUE_ID,
      })

      records = ['comment', 'reply'].flatMap((type) =>
        createRange(23).map((index) => ({
          // Reverse timestamp groups relative to IDs so ordering cannot rely on the ID alone.
          id: `${prefix}-${type}-${String((7 - Math.floor(index / 3)) * 3 + (index % 3)).padStart(2, '0')}`,
          body: `${prefix} ${type} ${index}`,
          postSlug: COMMENT_SUBMIT_AND_VIEW_POST_SLUG,
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

        const response = await page.request.post('/api/rpc/comments/list', {
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
        await page.getByRole('button', { name: en.blog_comments_sort_by }).click()
        await page
          .getByRole('menuitemradio', {
            name: sort === 'newest' ? en.blog_comments_newest : en.blog_comments_oldest,
            exact: true,
          })
          .click()

        const loaded = page.getByTestId(new RegExp(`^comment-${prefix}-comment-`))
        const expected = records.filter(({ parentId }) => parentId === null).map(({ id }) => `comment-${id}`)
        const expectedBySort = { newest: expected.toReversed(), oldest: expected }

        await expect(async () => {
          await page
            .locator('#comments')
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
      const response = await page.request.post('/api/rpc/comments/list', {
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

  test.describe('comment links', () => {
    for (const { locale, prefix, messages } of [
      { locale: 'en', prefix: '', messages: en },
      { locale: 'zh-TW', prefix: '/zh-TW', messages: zhTW },
    ]) {
      for (const type of ['comment', 'reply'] as const) {
        test(`opens a copied ${type} link in ${locale} in a fresh browser context`, async ({
          page,
          browser,
          baseURL,
          extraHTTPHeaders,
        }) => {
          const parentId = createId()
          const replyId = createId()
          const id = { comment: parentId, reply: replyId }[type]

          await db.insert(comments).values({
            id: parentId,
            body: `Link parent ${parentId}`,
            postSlug: COMMENT_SUBMIT_AND_VIEW_POST_SLUG,
            userId: TEST_UNIQUE_ID,
          })
          await db.insert(comments).values({
            id: replyId,
            parentId,
            body: `Link reply ${replyId}`,
            postSlug: COMMENT_SUBMIT_AND_VIEW_POST_SLUG,
            userId: TEST_UNIQUE_ID,
          })

          const fresh = await browser.newContext({
            baseURL,
            extraHTTPHeaders,
            storageState: { cookies: [], origins: [] },
          })

          try {
            await page.goto(`${prefix}/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}?comment=${parentId}`)
            await page
              .getByTestId(`comment-${id}`)
              .getByRole('button', { name: messages.blog_comments_open_menu, exact: true })
              .click()
            await page.getByRole('menuitem', { name: messages.blog_comments_copy_link, exact: true }).click()

            await expect(page.getByText(messages.success_link_copied, { exact: true })).toBeVisible()

            const copied = await page.evaluate(async () => navigator.clipboard.readText())
            const query = { comment: `comment=${parentId}`, reply: `comment=${parentId}&reply=${replyId}` }[type]
            expect(copied).toBe(`${baseURL}${prefix}/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}?${query}`)

            const target = await fresh.newPage()
            await target.goto(copied)

            await expect(target.locator('html')).toHaveAttribute('lang', locale)
            const highlight = target.getByTestId(`highlighted-comment-${id}`)
            await expect(highlight).toBeVisible()
            await expect(highlight).toHaveText(messages.blog_comments_highlighted_comment)
            await expect(target.getByTestId(`comment-${id}`)).toBeInViewport()
            await expect(
              target.getByTestId(`comment-${parentId}`).locator('button[aria-expanded]:not([aria-haspopup])'),
            ).toHaveAttribute('aria-expanded', 'true')
            await expect(target.getByText(`Link reply ${replyId}`, { exact: true })).toBeVisible()
          } finally {
            await fresh.close()
            await db.delete(comments).where(eq(comments.id, replyId))
            await db.delete(comments).where(eq(comments.id, parentId))
          }
        })
      }
    }
  })
})
