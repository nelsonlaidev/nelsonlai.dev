import en from '@messages/en.json' with { type: 'json' }
import zhTW from '@messages/zh-TW.json' with { type: 'json' }
import { allPosts } from 'content-collections'

import { locales } from '@/paraglide/runtime'

import { COMMENT_SUBMIT_AND_VIEW_POST_SLUG } from '../fixtures/posts'
import { expect, test } from '../fixtures/test'

const LOCALE_ITEMS = locales.map((value) => ({ value, label: value === 'en' ? 'English' : '繁體中文' }))

const articlePath = `/blog/${COMMENT_SUBMIT_AND_VIEW_POST_SLUG}`

test.describe('language switching', () => {
  for (const { value: locale, label } of LOCALE_ITEMS.filter((item) => item.value === 'en' || item.value === 'zh-TW')) {
    const sourcePrefix = locale === 'en' ? '/zh-TW' : ''
    const targetPrefix = locale === 'en' ? '' : '/zh-TW'
    const sourceMessages = locale === 'en' ? zhTW : en
    const targetMessages = locale === 'en' ? en : zhTW
    const post = allPosts.find((entry) => entry.slug === COMMENT_SUBMIT_AND_VIEW_POST_SLUG && entry.locale === locale)

    test(`switches an article to ${locale} and preserves the language after reloading`, async ({ page }) => {
      expect(post).toBeDefined()

      await page.goto(`${sourcePrefix}${articlePath}`)
      await page.getByRole('button', { name: sourceMessages.layout_change_language }).click()
      await page.getByRole('menuitemradio', { name: label, exact: true }).click()

      await expect(page).toHaveURL(`${targetPrefix}${articlePath}`)
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(post?.title ?? '')
      await expect(page.getByText(targetMessages.blog_header_published_on, { exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: targetMessages.layout_change_language })).toContainText(label)

      await page.reload()

      await expect(page).toHaveURL(`${targetPrefix}${articlePath}`)
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(post?.title ?? '')
      await expect(page.getByText(targetMessages.blog_header_published_on, { exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: targetMessages.layout_change_language })).toContainText(label)
    })

    test(`remembers ${locale} when opening an unprefixed page in a new tab`, async ({ page, context }) => {
      await page.goto(`${sourcePrefix}${articlePath}`)
      await page.getByRole('button', { name: sourceMessages.layout_change_language }).click()
      await page.getByRole('menuitemradio', { name: label, exact: true }).click()
      await expect(page).toHaveURL(`${targetPrefix}${articlePath}`)
      await expect(page.getByRole('button', { name: targetMessages.layout_change_language })).toContainText(label)

      const newPage = await context.newPage()
      await newPage.goto('/blog')

      await expect(newPage).toHaveURL(`${targetPrefix}/blog`)
      await expect(newPage.locator('html')).toHaveAttribute('lang', locale)
      await expect(newPage.getByRole('heading', { level: 1 })).toHaveText(targetMessages.common_labels_blog)
      await expect(newPage.getByRole('button', { name: targetMessages.layout_change_language })).toContainText(label)
    })
  }
})
