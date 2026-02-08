import { useMutation, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'
import type { CommentListInput } from '@/orpc/client'

export function useCreateVote(input: CommentListInput) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.vote.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.comment.list.key({ input }) })
      },
    }),
  )
}
