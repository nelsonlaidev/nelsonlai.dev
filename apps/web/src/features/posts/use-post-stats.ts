import type { PostStats } from './types'

import { useQuery } from '@tanstack/react-query'

import { orpc } from '@/lib/orpc-client'

function selectPostStatsBySlug(stats: PostStats[]) {
  return new Map(stats.map((postStats) => [postStats.slug, postStats]))
}

export function usePostStats(slugs: string[]) {
  const querySlugs = [...new Set(slugs)].toSorted()

  return useQuery(
    orpc.posts.stats.queryOptions({
      input: { slugs: querySlugs },
      enabled: querySlugs.length > 0,
      select: selectPostStatsBySlug,
    }),
  )
}
