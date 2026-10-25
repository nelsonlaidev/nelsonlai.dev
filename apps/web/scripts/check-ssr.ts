import assert from 'node:assert/strict'

import { baseLocale, locales } from '../src/paraglide/runtime.js'

const baseUrl = new URL(process.argv[2] ?? 'http://localhost:4173')

// Inspect HTTP HTML directly: client rendering can hide a failed server render.
await Promise.all(
  ['/blog', '/zh-TW/blog', ...locales.map((locale) => (locale === baseLocale ? '/about' : `/${locale}/about`))].map(
    async (pathname) => {
      const url = new URL(pathname, baseUrl)
      const response = await fetch(url, { signal: AbortSignal.timeout(10_000) })
      const html = await response.text()

      assert.equal(response.status, 200, `${pathname}: expected HTTP 200`)
      assert.ok(!html.includes('/@vite/client'), 'Run check:ssr against a production preview, not the dev server')
      assert.match(html, /<header\b/, `${pathname}: missing server-rendered header`)
      assert.match(html, /<main\b/, `${pathname}: missing server-rendered main content`)
      assert.match(html, /<footer\b/, `${pathname}: missing server-rendered footer`)

      if (pathname.endsWith('/about')) {
        const main = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(html)?.[1] ?? ''
        assert.match(main, /<h1\b/, `${pathname}: missing page heading`)
        assert.match(main, /<h2\b/, `${pathname}: missing MDX headings`)
        assert.match(main, /<p\b/, `${pathname}: missing MDX paragraphs`)
        assert.match(main, /TanStack Start/, `${pathname}: missing MDX body content`)
        assert.match(html, /rel="canonical"/, `${pathname}: missing canonical URL`)
        assert.match(html, /"@type":"AboutPage"/, `${pathname}: missing AboutPage structured data`)
      }

      console.log(`SSR passed: ${url}`)
    },
  ),
)
