import { useQuery } from '@tanstack/react-query'

import { orpc } from '@/lib/orpc-client'

export function useWakatimeStats() {
  return useQuery(orpc.wakatime.stats.queryOptions({ refetchOnWindowFocus: false }))
}
