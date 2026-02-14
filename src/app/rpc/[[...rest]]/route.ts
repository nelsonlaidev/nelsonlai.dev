import type { NextRequest } from 'next/server'

import { onError } from '@orpc/client'
import { RPCHandler } from '@orpc/server/fetch'

import { createORPCContext } from '@/orpc/context'
import { router } from '@/orpc/routers'

const handler = new RPCHandler(router, {
  interceptors: [
    onError((e) => {
      console.error(e)
    }),
  ],
})

async function handleRequest(request: NextRequest) {
  const { response } = await handler.handle(request, {
    prefix: '/rpc',
    context: await createORPCContext(request),
  })

  return response ?? new Response('Not found', { status: 404 })
}

export const HEAD = handleRequest
export const GET = handleRequest
export const POST = handleRequest
export const PUT = handleRequest
export const PATCH = handleRequest
export const DELETE = handleRequest
