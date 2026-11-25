import type { GuestbookCursor } from './types'

import { orpc } from '@/lib/orpc-client'

export const guestbookMessagesInfiniteOptions = orpc.guestbook.list.infiniteOptions({
  input: (cursor: GuestbookCursor) => ({ cursor }),
  initialPageParam: undefined,
  getNextPageParam: (page) => page.nextCursor,
})
