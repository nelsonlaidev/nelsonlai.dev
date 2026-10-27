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
        const { response } = await handler.handle(request, {
          prefix: '/api/rpc',
          context: await createORPCContext(request),
        })

        if (response && new URL(request.url).pathname.startsWith('/api/rpc/admin/')) {
          response.headers.set('Cache-Control', 'private, no-store')
        }

        return response ?? new Response('Not Found', { status: 404 })
      },
    },
  },
})
