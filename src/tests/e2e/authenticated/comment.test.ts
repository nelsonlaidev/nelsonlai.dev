import { createId } from '@paralleldrive/cuid2'
import test, { expect } from '@playwright/test'

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
import { getNumberFlow } from '../utils/number-flow'

async function getCount(locator: Parameters<typeof getNumberFlow>[0]) {
  return Number.parseInt(String(await getNumberFlow(locator)), 10)
}

test.describe('comment page', () => {
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
})
