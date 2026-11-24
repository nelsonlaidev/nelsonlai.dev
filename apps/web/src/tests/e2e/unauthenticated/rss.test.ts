import { allPosts } from 'content-collections'
import { SyntaxValidator } from 'fast-xml-validator'
import { create } from 'xmlbuilder2'

import { getLocalizedUrl } from '@/lib/seo'
import { baseLocale } from '@/paraglide/runtime'

import { expect, test } from '../fixtures/test'

test('serves an RSS feed linking to the published posts', async ({ request }) => {
  const response = await request.get('/rss.xml', { maxRedirects: 0 })
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toMatch(/^application\/(?:rss\+xml|xml)\b/i)

  const xml = await response.text()
  expect(SyntaxValidator.validate(xml)).toBe(true)
  const root = create(xml).root()
  expect(root.node.nodeName).toBe('rss')
  const channel = root.first()
  expect(channel.node.nodeName).toBe('channel')
  expect(channel.find((child) => child.node.nodeName === 'language')?.node.textContent).toBe(baseLocale)

  const links = channel
    .filter((child) => child.node.nodeName === 'item')
    .map((item) => item.find((child) => child.node.nodeName === 'link')?.node.textContent)
  const expected = allPosts
    .filter((post) => post.locale === baseLocale)
    .map((post) => getLocalizedUrl(`/blog/${post.slug}`, baseLocale))
  expect(links).toHaveLength(expected.length)
  expect(new Set(links)).toEqual(new Set(expected))
})
