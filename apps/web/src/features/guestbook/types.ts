import type { InferRouterOutputs } from '@orpc/server'
import type { router } from '@repo/api/routers'

export type GuestbookMessage = InferRouterOutputs<typeof router>['guestbook']['list']['messages'][number]

export type GuestbookCursor = InferRouterOutputs<typeof router>['guestbook']['list']['nextCursor']
