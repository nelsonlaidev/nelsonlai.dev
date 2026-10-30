import { orpc } from '@/lib/orpc-client'

export function accountSessionsQueryOptions(userId: string) {
  return orpc.account.listSessions.queryOptions({
    queryKey: [...orpc.account.listSessions.key(), { userId }],
  })
}
