import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useAdminComments() {
  return useQuery(orpc.admin.listAllComments.queryOptions({ placeholderData: keepPreviousData }))
}

export function useAdminUsers() {
  return useQuery(orpc.admin.listAllUsers.queryOptions({ placeholderData: keepPreviousData }))
}
