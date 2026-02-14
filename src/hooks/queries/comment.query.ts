import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { type CommentCountInput, type CommentListInput, orpc } from '@/orpc/client'

export function useListComments(input: (pageParam: Date | undefined) => CommentListInput, enabled = true) {
  return useInfiniteQuery(
    orpc.comment.list.infiniteOptions({
      input,
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
      enabled,
    }),
  )
}

export function useCountComment(input: CommentCountInput) {
  return useQuery(orpc.comment.count.queryOptions({ input }))
}

export function useCreatePostComment(input: CommentListInput, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.comment.create.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.comment.list.key({ input }) })
        void queryClient.invalidateQueries({ queryKey: orpc.comment.count.key({ input }) })
        void queryClient.invalidateQueries({ queryKey: orpc.reply.count.key({ input }) })
        onSuccess?.()
      },
    }),
  )
}

export function useDeletePostComment(input: CommentListInput, onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.comment.delete.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.comment.list.key({ input }) })
        void queryClient.invalidateQueries({ queryKey: orpc.comment.count.key({ input }) })
        void queryClient.invalidateQueries({ queryKey: orpc.reply.count.key({ input }) })
        onSuccess?.()
      },
    }),
  )
}
