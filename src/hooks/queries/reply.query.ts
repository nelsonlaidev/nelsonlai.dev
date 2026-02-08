import { useQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'
import type { ReplyCountInput } from '@/orpc/client'

export function useCountReply(input: ReplyCountInput) {
  return useQuery(orpc.reply.count.queryOptions({ input }))
}
