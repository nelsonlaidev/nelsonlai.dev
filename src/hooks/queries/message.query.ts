import { keepPreviousData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useListMessages() {
  return useInfiniteQuery(
    orpc.message.list.infiniteOptions({
      input: (pageParam: Date | undefined) => ({ cursor: pageParam }),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
    }),
  )
}

export function useCreateMessage(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.message.create.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.message.list.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useDeleteMessage(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.message.delete.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.message.list.key() })
        onSuccess?.()
      },
    }),
  )
}
