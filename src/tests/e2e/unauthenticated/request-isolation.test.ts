import { randomBytes } from 'node:crypto'

import { COMMENT_SUBMIT_AND_VIEW_POST_SLUG } from '../fixtures/posts'
import { expect, test } from '../fixtures/test'

test.describe('request isolation', () => {
  for (const { name, path, options } of [
    {
      name: 'RPC',
      path: '/rpc/view/count',
      options: { method: 'POST', data: { json: { slug: COMMENT_SUBMIT_AND_VIEW_POST_SLUG } } },
    },
    { name: 'auth', path: '/api/auth/get-session', options: { method: 'GET' } },
  ]) {
    test(`keeps ${name} rate limits isolated after one client is throttled`, async ({
      request,
      playwright,
      baseURL,
      extraHTTPHeaders,
    }) => {
      // Follow the fixture's /64 subnet pattern so Better Auth treats this as an independent client.
      const address = randomBytes(4)
      const ip = `2001:db8:${address.readUInt16BE(0).toString(16)}:${address.readUInt16BE(2).toString(16)}::1`
      const otherClient = await playwright.request.newContext({
        baseURL,
        extraHTTPHeaders: { ...extraHTTPHeaders, 'x-real-ip': ip, 'x-forwarded-for': ip },
      })

      try {
        await expect(await otherClient.fetch(path, options)).toBeOK()

        // Retry saturation and both clients together if the rate-limit window changes between requests.
        await expect(async () => {
          const responses = await Promise.all(Array.from({ length: 10 }, async () => request.fetch(path, options)))
          await Promise.all(
            responses
              .filter((response) => response.status() !== 429)
              .map(async (response) => {
                await expect(response).toBeOK()
              }),
          )
          expect(responses.map((response) => response.status())).toContain(429)

          const [limitedResponse, independentResponse] = await Promise.all([
            request.fetch(path, options),
            otherClient.fetch(path, options),
          ])
          expect(limitedResponse.status()).toBe(429)
          await expect(independentResponse).toBeOK()
        }).toPass({ timeout: 5000, intervals: [0] })
      } finally {
        await otherClient.dispose()
      }
    })
  }
})
