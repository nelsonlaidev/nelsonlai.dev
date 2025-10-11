import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useReplyNotificationPrefs = () => {
  return useQuery(orpc.unsubscribes.getReplyNotificationPrefs.queryOptions())
}

export const useUpdateGlobalReplyNotificationPrefs = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.unsubscribes.updateGlobalReplyNotificationPrefs.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.unsubscribes.getReplyNotificationPrefs.key() })
        onSuccess?.()
      }
    })
  )
}

export const useUpdateReplyNotificationPrefs = (onSuccess?: () => void) => {
  return useMutation(
    orpc.unsubscribes.updateReplyNotificationPrefs.mutationOptions({
      onSuccess: () => {
        onSuccess?.()
      }
    })
  )
}
