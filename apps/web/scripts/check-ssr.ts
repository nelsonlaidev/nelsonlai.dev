import assert from 'node:assert/strict'

import { baseLocale, locales } from '../src/paraglide/runtime.js'

const baseUrl = new URL(process.argv[2] ?? 'http://localhost:4173')

// Inspect HTTP HTML directly: client rendering can hide a failed server render.
await Promise.all(
  [
    '/blog',
    '/zh-TW/blog',
    ...locales.map((locale) => (locale === baseLocale ? '/' : `/${locale}`)),
    ...locales.flatMap((locale) =>
      ['/about', '/projects'].map((pathname) => (locale === baseLocale ? pathname : `/${locale}${pathname}`)),
    ),
  ].map(async (pathname) => {
    const url = new URL(pathname, baseUrl)
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    const html = await response.text()

    assert.equal(response.status, 200, `${pathname}: expected HTTP 200`)
    assert.ok(!html.includes('/@vite/client'), 'Run check:ssr against a production preview, not the dev server')
    assert.match(html, /<header\b/, `${pathname}: missing server-rendered header`)
    assert.match(html, /<main\b/, `${pathname}: missing server-rendered main content`)
    assert.match(html, /<footer\b/, `${pathname}: missing server-rendered footer`)
    assert.match(html, /name="author"/, `${pathname}: missing author metadata`)
    assert.match(html, /name="creator"/, `${pathname}: missing creator metadata`)
    assert.match(html, /name="robots"/, `${pathname}: missing robots metadata`)
    assert.match(html, /name="twitter:site"/, `${pathname}: missing Twitter account`)
    assert.match(html, /href="\/favicon\.svg"/, `${pathname}: missing SVG favicon`)
    assert.match(html, /rel="manifest"/, `${pathname}: missing web app manifest`)
    assert.equal(
      [...html.matchAll(/<meta\b[^>]+\bname="theme-color"[^>]*>/g)].length,
      2,
      `${pathname}: expected light and dark theme colors`,
    )

    if (!pathname.endsWith('/blog')) {
      assert.match(html, /rel="canonical"/, `${pathname}: missing canonical URL`)
      assert.match(html, /property="og:url"/, `${pathname}: missing Open Graph URL`)
      assert.match(html, /property="og:locale"/, `${pathname}: missing Open Graph locale`)
      assert.match(html, /name="twitter:card"/, `${pathname}: missing Twitter card`)
      assert.equal(
        [...html.matchAll(/<link\b[^>]+\brel="alternate"[^>]*>/g)].length,
        locales.length + 1,
        `${pathname}: expected all locale alternates and x-default`,
      )
    }

    if (pathname.endsWith('/about')) {
      const main = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(html)?.[1] ?? ''
      assert.match(main, /<h1\b/, `${pathname}: missing page heading`)
      assert.match(main, /<h2\b/, `${pathname}: missing MDX headings`)
      assert.match(main, /<p\b/, `${pathname}: missing MDX paragraphs`)
      assert.match(main, /TanStack Start/, `${pathname}: missing MDX body content`)
      assert.match(html, /"@type":"AboutPage"/, `${pathname}: missing AboutPage structured data`)
    }

    console.log(`SSR passed: ${url}`)
  }),
)
