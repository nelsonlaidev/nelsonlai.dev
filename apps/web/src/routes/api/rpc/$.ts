import { onError } from '@orpc/client'
import { RPCHandler } from '@orpc/server/fetch'
import { router } from '@repo/api/routers'
import { createFileRoute } from '@tanstack/react-router'

import { createORPCContext } from '@/lib/orpc-context'

const handler = new RPCHandler(router, {
  interceptors: [
    onError((rpcError) => {
      console.error(rpcError)
    }),
  ],
})

export const Route = createFileRoute('/api/rpc/$')({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        if (request.signal.aborted) {
          return Response.json({ json: { code: 'CLIENT_CLOSED_REQUEST' } }, { status: 499 })
        }

        const { response } = await handler.handle(request, {
          prefix: '/api/rpc',
          context: await createORPCContext(request),
        })

        return response ?? new Response('Not Found', { status: 404 })
      },
    },
  },
})
