import en from '@messages/en.json' with { type: 'json' }

import { expect, test } from '../fixtures/comment'
import { COMMENT_SUBMIT_AND_VIEW_POST_SLUG } from '../fixtures/posts'
import { toastTitle } from '../utils/toast'

for (const failure of ['provider', 'network']) {
  test(`shows a sign-in toast for a ${failure} failure`, async ({ page }) => {
    const providerMessage = 'Provider denied access'
    await page.route('**/api/auth/sign-in/social', async (route) =>
      failure === 'network'
        ? route.abort('failed')
        : route.fulfill({ status: 403, json: { code: 'FORBIDDEN', message: providerMessage } }),
    )
    await page.goto('/guestbook')
    await page.getByRole('main').getByRole('button', { name: en.common_sign_in, exact: true }).click()
    await page
      .getByRole('dialog')
      .getByRole('button', { name: /GitHub/ })
      .click()
    await expect(
      toastTitle(page, 'error', failure === 'network' ? en.error_sign_in_error : providerMessage),
    ).toBeVisible()
  })
}

test('shows a sign-in toast when a guest votes on a comment', async ({ page, savedComment }) => {
  await page.goto(`/blog/${savedComment.postSlug}?comment=${savedComment.id}`)
  await page
    .getByTestId(`comment-${savedComment.id}`)
    .getByRole('button', { name: en.common_like, exact: true })
    .click()
  await expect(toastTitle(page, 'error', en.error_need_logged_in_to_vote)).toBeVisible()
})

test.describe('clipboard denial', () => {
  test.use({ permissions: [] })

  test('shows a clipboard error toast when copying a comment link', async ({ page, savedComment }) => {
    await page.goto(`/blog/${savedComment.postSlug}?comment=${savedComment.id}`)
    await page
      .getByTestId(`comment-${savedComment.id}`)
      .getByRole('button', { name: en.blog_comments_open_menu })
      .click()
    await page.getByRole('menuitem', { name: en.blog_comments_copy_link }).click()
    await expect(toastTitle(page, 'error', en.error_copy_to_clipboard_error)).toBeVisible()
  })

  test('shows a clipboard error toast when copying a code block', async ({ page }) => {
    await page.goto(`/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}`)
    await page.getByRole('button', { name: en.common_aria_labels_copy_code }).first().click()
    await expect(toastTitle(page, 'error', en.error_copy_to_clipboard_error)).toBeVisible()
  })
})
