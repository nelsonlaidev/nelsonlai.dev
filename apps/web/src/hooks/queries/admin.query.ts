import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useListAdminComments() {
  return useQuery(orpc.admin.comment.list.queryOptions({ placeholderData: keepPreviousData }))
}

export function useListAdminUsers() {
  return useQuery(orpc.admin.user.list.queryOptions({ placeholderData: keepPreviousData }))
}
