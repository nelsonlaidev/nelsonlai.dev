import type { Outputs } from '@repo/api/routers'

export type GuestbookMessage = Outputs['guestbook']['list']['messages'][number]

export type GuestbookCursor = Outputs['guestbook']['list']['nextCursor']
