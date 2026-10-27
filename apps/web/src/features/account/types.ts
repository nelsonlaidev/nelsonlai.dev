import type { InferRouterOutputs } from '@orpc/server'
import type { router } from '@repo/api/routers'

export type AccountSession = InferRouterOutputs<typeof router>['account']['listSessions'][number]
