import assert from 'node:assert/strict'

import { measure } from 'takumi-js'

import { baseLocale, locales } from '../src/paraglide/runtime.js'

const baseUrl = new URL(process.argv[2] ?? 'http://localhost:4173')

async function checkOgImage(url: URL) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  assert.equal(response.status, 200, `${url.pathname}: image request failed`)
  assert.equal(response.headers.get('content-type'), 'image/webp', `${url.pathname}: expected WebP image`)
  const bytes = Buffer.from(await response.arrayBuffer())
  assert.equal(bytes.toString('ascii', 0, 4), 'RIFF', `${url.pathname}: invalid WebP container`)
  assert.equal(bytes.toString('ascii', 8, 12), 'WEBP', `${url.pathname}: invalid WebP image`)

  const size = await measure({ type: 'image', src: 'og-image' }, { images: [{ src: 'og-image', data: bytes }] })
  assert.equal(size.width, 1200, `${url.pathname}: incorrect image width`)
  assert.equal(size.height, 630, `${url.pathname}: incorrect image height`)
  return bytes
}

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
      assert.match(html, /name="twitter:card" content="summary_large_image"/, `${pathname}: expected large image card`)
      assert.match(html, /property="og:image:type" content="image\/webp"/, `${pathname}: incorrect image MIME type`)
      assert.match(html, /property="og:image:width" content="1200"/, `${pathname}: incorrect image width metadata`)
      assert.match(html, /property="og:image:height" content="630"/, `${pathname}: incorrect image height metadata`)

      const image = /property="og:image" content="([^"]+)"/.exec(html)?.[1]
      assert.ok(image, `${pathname}: missing Open Graph image`)
      const imageUrl = new URL(image.replaceAll('&amp;', '&'))
      const locale =
        locales.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) ?? baseLocale
      const pagePath = locale === baseLocale ? pathname : pathname.slice(locale.length + 1) || '/'
      const localePrefix = locale === baseLocale ? '' : `/${locale}`
      assert.equal(
        imageUrl.pathname,
        `${localePrefix}/og${pagePath === '/' ? '' : pagePath}/image.webp`,
        `${pathname}: incorrect localized image URL`,
      )
      assert.equal(imageUrl.search, '', `${pathname}: image URL must use path segments`)
      const twitterImage = /name="twitter:image" content="([^"]+)"/.exec(html)?.[1]
      assert.equal(twitterImage, image, `${pathname}: Twitter and Open Graph images must match`)

      await checkOgImage(new URL(imageUrl.pathname, baseUrl))
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

await Promise.all(
  locales.flatMap((locale) =>
    ['blog/php', 'projects/blog'].map(async (slug) => {
      const prefix = locale === baseLocale ? '' : `/${locale}`
      const url = new URL(`${prefix}/og/${slug}/image.webp`, baseUrl)
      const bytes = await checkOgImage(url)
      const preferredLocale = locale === 'ja' ? baseLocale : 'ja'
      const response = await fetch(url, {
        headers: { Cookie: `PARAGLIDE_LOCALE=${preferredLocale}`, 'Accept-Language': preferredLocale },
        signal: AbortSignal.timeout(30_000),
      })
      assert.equal(response.status, 200, `${url.pathname}: image request with locale preferences failed`)
      assert.deepEqual(
        Buffer.from(await response.arrayBuffer()),
        bytes,
        `${url.pathname}: image locale must be determined by the URL`,
      )
      console.log(`OG passed: ${url}`)
    }),
  ),
)

await Promise.all(
  (
    [
      ['/og/missing/image.webp', 404],
      ['/og/blog/missing/image.webp', 404],
      ['/og/projects/missing/image.webp', 404],
      ['/og/about/image.png', 404],
      ['/og/about', 404],
    ] as const
  ).map(async ([pathname, expectedStatus]) => {
    const response = await fetch(new URL(pathname, baseUrl))
    assert.equal(response.status, expectedStatus, `Invalid image request: ${pathname}`)
  }),
)
