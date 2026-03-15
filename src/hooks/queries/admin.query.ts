import type { AdminCommentListInput, AdminUserListInput } from '@/orpc/client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

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
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return useQuery(
    orpc.admin.trends.queryOptions({
      input: { days, timezone },
      placeholderData: keepPreviousData,
    }),
  )
}
