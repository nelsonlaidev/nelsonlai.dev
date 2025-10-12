import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useReplyPrefs = () => {
  return useQuery(orpc.unsubscribes.getReplyPrefs.queryOptions())
}

export const useUpdateReplyPrefs = (onSuccess?: () => void) => {
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

export const useUpdateCommentReplyPrefs = (onSuccess?: () => void) => {
  return useMutation(
    orpc.unsubscribes.updateCommentReplyPrefs.mutationOptions({
      onSuccess: () => {
        onSuccess?.()
      }
    })
  )
}
