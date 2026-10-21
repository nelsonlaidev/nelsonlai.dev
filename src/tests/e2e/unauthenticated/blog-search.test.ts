import { allPosts } from 'content-collections'

import en from '@/i18n/messages/en.json' with { type: 'json' }

import { COMMENT_SUBMIT_AND_VIEW_POST_SLUG } from '../fixtures/posts'
import { expect, test } from '../fixtures/test'

const searchMessages = en.components['filtered-posts']
const englishPosts = allPosts.filter((post) => post.locale === 'en')

test.describe('blog search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog')
  })

  test('filters articles by a partial title and shows multiple matches', async ({ page }) => {
    const postTitles = page.getByRole('main').getByRole('heading', { level: 3 })
    const query = 'with'
    const expectedPosts = englishPosts.filter((post) => post.title.toLowerCase().includes(query))

    await page.getByRole('textbox', { name: searchMessages.placeholder }).fill(query)

    await expect(postTitles).toHaveCount(expectedPosts.length)
    await Promise.all(
      expectedPosts.map(async (post) => {
        await expect(page.getByRole('main').getByRole('heading', { name: post.title, exact: true })).toBeVisible()
      }),
    )
    await expect(page.getByText(searchMessages['no-posts-found'], { exact: true })).toBeHidden()
  })

  for (const query of ['better auth', 'BETTER AUTH', 'bEtTeR aUtH']) {
    test(`finds the same article when searching for "${query}"`, async ({ page }) => {
      const resultLinks = page
        .getByRole('main')
        .getByRole('link')
        .filter({ has: page.getByRole('heading', { level: 3 }) })

      await page.getByRole('textbox', { name: searchMessages.placeholder }).fill(query)

      await expect(resultLinks).toHaveCount(1)
      await expect(resultLinks).toHaveAttribute('href', `/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}`)
      await expect(page.getByText(searchMessages['no-posts-found'], { exact: true })).toBeHidden()
    })
  }

  test('shows an empty state and recovers when the search matches an article', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: searchMessages.placeholder })
    const postTitles = page.getByRole('main').getByRole('heading', { level: 3 })
    const emptyState = page.getByText(searchMessages['no-posts-found'], { exact: true })
    const post = englishPosts.find((entry) => entry.slug === COMMENT_SUBMIT_AND_VIEW_POST_SLUG)
    expect(post).toBeDefined()

    await searchInput.fill('no-matching-blog-post-e2e')

    await expect(emptyState).toBeVisible()
    await expect(postTitles).toHaveCount(0)

    await searchInput.fill('Better Auth')

    await expect(emptyState).toBeHidden()
    await expect(postTitles).toHaveText([post?.title ?? ''])
  })

  test('restores all articles in their original order when the search is cleared', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: searchMessages.placeholder })
    const postTitles = page.getByRole('main').getByRole('heading', { level: 3 })

    await expect(postTitles).toHaveCount(englishPosts.length)
    const initialTitles = await postTitles.allTextContents()

    await searchInput.fill('Better Auth')
    await expect(postTitles).toHaveCount(1)

    await searchInput.clear()

    await expect(searchInput).toHaveValue('')
    await expect(postTitles).toHaveText(initialTitles)
    await expect(page.getByText(searchMessages['no-posts-found'], { exact: true })).toBeHidden()
  })

  test('opens an article from the search results', async ({ page }) => {
    const resultLinks = page
      .getByRole('main')
      .getByRole('link')
      .filter({ has: page.getByRole('heading', { level: 3 }) })
    const post = englishPosts.find((entry) => entry.slug === COMMENT_SUBMIT_AND_VIEW_POST_SLUG)
    expect(post).toBeDefined()

    await page.getByRole('textbox', { name: searchMessages.placeholder }).fill('Better Auth')
    await expect(resultLinks).toHaveCount(1)
    await resultLinks.click()

    await expect(page).toHaveURL(`/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(post?.title ?? '')
    await expect(page.getByRole('article')).toBeVisible()
  })
})
