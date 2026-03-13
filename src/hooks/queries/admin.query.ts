import type { AdminCommentListInput } from '@/orpc/client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useListCommentsAdmin(input: AdminCommentListInput) {
  return useQuery(orpc.admin.comment.list.queryOptions({ input, placeholderData: keepPreviousData }))
}

export function useListUsersAdmin() {
  return useQuery(orpc.admin.user.list.queryOptions({ placeholderData: keepPreviousData }))
}
