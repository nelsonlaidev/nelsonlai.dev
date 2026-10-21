// @vitest-environment node

import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { POST } from '@/app/rpc/[[...rest]]/route'
import { createORPCContext } from '@/orpc/context'

vi.mock('@/orpc/context', () => ({
  createORPCContext: vi.fn<() => Promise<object>>().mockResolvedValue({}),
}))

vi.mock('@/orpc/routers', async () => {
  const { os } = await import('@orpc/server')
  const { CountViewInputSchema, CountViewOutputSchema } = await import('@/orpc/schemas/view.schema')

  return {
    router: {
      view: {
        count: os
          .input(CountViewInputSchema)
          .output(CountViewOutputSchema)
          .handler(() => ({ views: 0 })),
      },
    },
  }
})

describe('RPC route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test.each([
    { name: 'AbortError', reason: undefined },
    {
      name: 'ResponseAborted',
      reason: Object.assign(new Error('The client disconnected'), { name: 'ResponseAborted' }),
    },
  ])('handles an already aborted request before decoding its body ($name)', async ({ reason }) => {
    expect.assertions(7)

    const controller = new AbortController()
    controller.abort(reason)

    // Next.js drops an already aborted request's body while retaining its headers.
    const request = new NextRequest('http://localhost:3000/rpc/view/count', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'content-length': '56' },
      signal: controller.signal,
    })
    const readBody = vi.spyOn(request, 'text')

    expect(request.signal.aborted).toBe(true)
    expect(request.body).toBeNull()

    const response = await POST(request)

    expect(response.status).toBe(499)
    expect(createORPCContext).toHaveBeenCalledOnce()
    expect(readBody).not.toHaveBeenCalled()
    expect(await response.json()).toMatchObject({ json: { code: 'CLIENT_CLOSED_REQUEST' } })
    expect(console.error).not.toHaveBeenCalled()
  })

  test('still validates and reports invalid input for active requests', async () => {
    expect.assertions(4)

    const response = await POST(
      new NextRequest('http://localhost:3000/rpc/view/count', {
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

  test('handles valid active requests normally', async () => {
    expect.assertions(4)

    const response = await POST(
      new NextRequest('http://localhost:3000/rpc/view/count', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ json: { slug: 'test-post' } }),
      }),
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ json: { views: 0 } })
    expect(createORPCContext).toHaveBeenCalledOnce()
    expect(console.error).not.toHaveBeenCalled()
  })
})
