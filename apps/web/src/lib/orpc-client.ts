import type { RouterClient } from '@orpc/server'

import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createRouterClient } from '@orpc/server'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { router } from '@repo/api/routers'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

import { createORPCContext } from './orpc-context'

const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(router, {
      context: async () => createORPCContext(getRequest()),
    }),
  )
  .client((): RouterClient<typeof router> => {
    const link = new RPCLink({
      url: '/api/rpc',
    })

    return createORPCClient(link)
  })

export const client: RouterClient<typeof router> = getORPCClient()
export const orpc = createTanstackQueryUtils(client)
