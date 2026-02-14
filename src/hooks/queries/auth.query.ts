import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useListSessions() {
  return useQuery(orpc.auth.session.list.queryOptions())
}

export function useRevokeSession(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.auth.session.revoke.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.auth.session.list.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useUpdateUser(onSuccess?: () => void) {
  return useMutation(orpc.auth.user.update.mutationOptions({ onSuccess }))
}
