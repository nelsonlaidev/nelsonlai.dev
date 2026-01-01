import type { router } from './routers'
import type { InferRouterInputs, InferRouterOutputs, RouterClient } from '@orpc/server'

import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

import { IS_SERVER } from '@/lib/constants'
import { getBaseUrl } from '@/utils/get-base-url'

const link = new RPCLink({
  url: `${IS_SERVER ? getBaseUrl() : globalThis.location.origin}/rpc`
})

const client: RouterClient<typeof router> = createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)

export type Inputs = InferRouterInputs<typeof router>
export type Outputs = InferRouterOutputs<typeof router>
