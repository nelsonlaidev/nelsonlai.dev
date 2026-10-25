import assert from 'node:assert/strict'

const baseUrl = new URL(process.argv[2] ?? 'http://localhost:4173')

// Inspect HTTP HTML directly: client rendering can hide a failed server render.
await Promise.all(
  ['/blog', '/zh-TW/blog'].map(async (pathname) => {
    const url = new URL(pathname, baseUrl)
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    const html = await response.text()

    assert.equal(response.status, 200, `${pathname}: expected HTTP 200`)
    assert.ok(!html.includes('/@vite/client'), 'Run check:ssr against a production preview, not the dev server')
    assert.match(html, /<header\b/, `${pathname}: missing server-rendered header`)
    assert.match(html, /<main\b/, `${pathname}: missing server-rendered main content`)
    assert.match(html, /<footer\b/, `${pathname}: missing server-rendered footer`)

    console.log(`SSR passed: ${url}`)
  }),
)
