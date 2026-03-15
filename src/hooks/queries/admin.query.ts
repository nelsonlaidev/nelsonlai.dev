import type { AdminCommentListInput, AdminUserListInput } from '@/orpc/client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { endOfDay, formatISO, startOfDay, subDays } from 'date-fns'

import { orpc } from '@/orpc/client'

export function useListCommentsAdmin(input: AdminCommentListInput) {
  return useQuery(orpc.admin.comment.list.queryOptions({ input, placeholderData: keepPreviousData }))
}

export function useListUsersAdmin(input: AdminUserListInput) {
  return useQuery(orpc.admin.user.list.queryOptions({ input, placeholderData: keepPreviousData }))
}

export function useAdminStats() {
  return useQuery(orpc.admin.stats.queryOptions())
}

export function useAdminRecentActivity() {
  return useQuery(orpc.admin.recentActivity.queryOptions())
}

export function useAdminTrends(days: number) {
  const now = new Date()
  const start = startOfDay(subDays(now, days))
  const end = endOfDay(now)
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return useQuery(
    orpc.admin.trends.queryOptions({
      input: {
        start: formatISO(start),
        end: formatISO(end),
        timezone,
      },
      placeholderData: keepPreviousData,
    }),
  )
}
