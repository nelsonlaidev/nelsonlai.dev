// @vitest-environment node
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { createORPCContext } from '@/lib/orpc-context'
import { Route } from '@/routes/api/rpc/$'

vi.mock('@/lib/orpc-context', () => ({
  createORPCContext: vi.fn<() => Promise<Record<string, never>>>().mockResolvedValue({}),
}))
vi.mock('@repo/api/routers', async () => {
  const { os } = await import('@orpc/server')
  const { PostSlugInputSchema } = await import('@repo/api/schema/posts')
  return {
    router: { posts: { likes: os.input(PostSlugInputSchema).handler(() => ({ likes: 0, currentUserLikes: 0 })) } },
  }
})

const handlers = Route.options.server?.handlers
if (!handlers || typeof handlers === 'function' || !handlers.ANY) throw new Error('Expected static route handlers')
const handleRequest = handlers.ANY
const handle = async (request: Request) => {
  const response = await handleRequest({ request } as never)
  if (!(response instanceof Response)) throw new Error('Expected an HTTP response')
  return response
}
describe('RPC route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => vi.restoreAllMocks())
  test.each([undefined, Object.assign(new Error('Disconnected'), { name: 'ResponseAborted' })])(
    'does not decode an aborted request',
    async (reason) => {
      const controller = new AbortController()
      controller.abort(reason)
      const request = new Request('http://localhost:3100/api/rpc/posts/likes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: controller.signal,
      })
      const readBody = vi.spyOn(request, 'text')
      const response = await handle(request)
      expect(response.status).toBe(499)
      expect(readBody).not.toHaveBeenCalled()
      expect(await response.json()).toMatchObject({ json: { code: 'CLIENT_CLOSED_REQUEST' } })
      expect(console.error).not.toHaveBeenCalled()
    },
  )
  test('rejects invalid input for an active request', async () => {
    const response = await handle(
      new Request('http://localhost:3100/api/rpc/posts/likes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ json: {} }),
      }),
    )
    expect(response.status).toBe(400)
    expect(await response.json()).toMatchObject({ json: { code: 'BAD_REQUEST' } })
    expect(createORPCContext).toHaveBeenCalledOnce()
    expect(console.error).toHaveBeenCalled()
  })
  test('handles valid active requests', async () => {
    const response = await handle(
      new Request('http://localhost:3100/api/rpc/posts/likes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ json: { slug: 'php' } }),
      }),
    )
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ json: { likes: 0, currentUserLikes: 0 } })
    expect(console.error).not.toHaveBeenCalled()
  })
})
