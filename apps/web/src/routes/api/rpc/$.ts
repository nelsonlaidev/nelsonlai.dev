import { onError } from '@orpc/client'
import { BodyLimitPlugin, RPCHandler } from '@orpc/server/fetch'
import { router } from '@repo/api/routers'
import { AVATAR_MAX_FILE_SIZE } from '@repo/api/schema/account'
import { createFileRoute } from '@tanstack/react-router'

import { createORPCContext } from '@/lib/orpc-context'

const handler = new RPCHandler(router, {
  plugins: [new BodyLimitPlugin({ maxBodySize: AVATAR_MAX_FILE_SIZE })],
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
