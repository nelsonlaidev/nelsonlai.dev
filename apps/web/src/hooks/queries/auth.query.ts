import { useQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useListSessions = () => {
  return useQuery(orpc.auth.listSessions.queryOptions())
}
