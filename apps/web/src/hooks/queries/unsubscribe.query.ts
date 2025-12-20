import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useReplyPrefs() {
  return useQuery(orpc.unsubscribes.getReplyPrefs.queryOptions())
}

export function useUpdateReplyPrefs(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.unsubscribes.updateReplyPrefs.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.unsubscribes.getReplyPrefs.key() })
        onSuccess?.()
      }
    })
  )
}

export function useUpdateCommentReplyPrefs(onSuccess?: () => void) {
  return useMutation(
    orpc.unsubscribes.updateCommentReplyPrefs.mutationOptions({
      onSuccess: () => {
        onSuccess?.()
      }
    })
  )
}
