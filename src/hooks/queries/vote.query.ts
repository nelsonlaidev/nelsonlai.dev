import { useMutation, useQueryClient } from '@tanstack/react-query'

import { type CommentListInput, orpc } from '@/orpc/client'

export function useCreateVote(input: CommentListInput) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.vote.create.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.comment.list.key({ input }) })
      },
    }),
  )
}
