import type { InferRouterOutputs } from '@orpc/server'
import type { router } from '@repo/api/routers'

export type Comment = InferRouterOutputs<typeof router>['comments']['list']['comments'][number]
