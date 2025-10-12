import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useReplyPrefs = () => {
  return useQuery(orpc.notifications.getReplyPrefs.queryOptions())
}

export const useUpdateReplyPrefs = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.notifications.updateReplyPrefs.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.notifications.getReplyPrefs.key() })
        onSuccess?.()
      }
    })
  )
}

export const useUpdateCommentReplyPrefs = (onSuccess?: () => void) => {
  return useMutation(
    orpc.notifications.updateCommentReplyPrefs.mutationOptions({
      onSuccess: () => {
        onSuccess?.()
      }
    })
  )
}
