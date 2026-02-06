import type { router } from './routers'
import type { InferRouterInputs, InferRouterOutputs, RouterClient } from '@orpc/server'

import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'

import { IS_SERVER } from '@/lib/constants'
import { getBaseUrl } from '@/utils/get-base-url'

const link = new RPCLink({
  url: `${IS_SERVER ? getBaseUrl() : globalThis.location.origin}/rpc`,
})

const client: RouterClient<typeof router> = createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)

type Inputs = InferRouterInputs<typeof router>
type Outputs = InferRouterOutputs<typeof router>

export type CommentCountInput = Inputs['comment']['count']
export type CommentListInput = Inputs['comment']['list']
export type LikeCountInput = Inputs['like']['count']
export type ReplyCountInput = Inputs['reply']['count']
export type ViewCountInput = Inputs['view']['count']

export type AdminCommentListOutput = Outputs['admin']['comment']['list']
export type AdminUserListOutput = Outputs['admin']['user']['list']
export type SessionListOutput = Outputs['auth']['session']['list']
export type CommentListOutput = Outputs['comment']['list']
export type LikeCountOutput = Outputs['like']['count']
export type MessageListOutput = Outputs['message']['list']
export type SettingsGetOutput = Outputs['settings']['get']
