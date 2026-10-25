import { useQuery } from '@tanstack/react-query'

import { orpc } from '@/lib/orpc-client'

export function usePostStats(slugs: string[]) {
  const querySlugs = [...new Set(slugs)].toSorted()

  return useQuery(
    orpc.posts.stats.queryOptions({
      input: { slugs: querySlugs },
      enabled: querySlugs.length > 0,
    }),
  )
}
