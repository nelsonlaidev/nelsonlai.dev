import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useListSessions = () => {
  return useQuery(orpc.auth.listSessions.queryOptions())
}

export const useRevokeSession = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.auth.revokeSession.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.auth.listSessions.key() })
        onSuccess?.()
      }
    })
  )
}

export const useUpdateUser = (onSuccess?: () => void) => {
  return useMutation(
    orpc.auth.updateUser.mutationOptions({
      onSuccess: () => {
        onSuccess?.()
      }
    })
  )
}
