import type { ListCommentsInputSchema } from '@repo/api/schema/comments'
import type { InfiniteQueryCursorSchema } from '@repo/api/schema/pagination'
import type * as z from 'zod'

import { orpc } from '@/lib/orpc-client'

export function commentListOptions(
  input: Omit<z.input<typeof ListCommentsInputSchema>, 'cursor'>,
  userId: string | null = null,
) {
  return orpc.comments.list.infiniteOptions({
    input: (cursor: z.infer<typeof InfiniteQueryCursorSchema> | undefined) => ({ ...input, cursor }),
    initialPageParam: undefined,
    queryKey: [...orpc.comments.list.key(), { input, userId }],
    getNextPageParam: (page) => page.nextCursor,
  })
}
