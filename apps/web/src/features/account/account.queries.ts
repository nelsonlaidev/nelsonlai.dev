import { ORPCError } from '@orpc/client'

import { orpc } from '@/lib/orpc-client'

export function accountSessionsQueryOptions(userId: string) {
  return orpc.account.listSessions.queryOptions({
    queryKey: [...orpc.account.listSessions.key(), { userId }],
    meta: { errorHandledLocally: true },
    retry: (failureCount, error) =>
      (!(error instanceof ORPCError) || error.code !== 'SESSION_NOT_FRESH') && failureCount < 3,
  })
}
