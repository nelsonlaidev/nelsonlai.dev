import { keepPreviousData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useMessages = () => {
  return useInfiniteQuery(
    orpc.messages.list.infiniteOptions({
      input: (pageParam: Date | undefined) => ({ cursor: pageParam }),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData
    })
  )
}

export const useCreateMessage = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.messages.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.messages.list.key() })
        onSuccess?.()
      }
    })
  )
}

export const useDeleteMessage = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.messages.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.messages.list.key() })
        onSuccess?.()
      }
    })
  )
}
