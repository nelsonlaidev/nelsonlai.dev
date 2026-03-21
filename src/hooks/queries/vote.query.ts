import type { InfiniteData } from '@tanstack/react-query'
import type { CommentListInput, CommentListOutput } from '@/orpc/client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

type CommentListInfiniteData = InfiniteData<CommentListOutput, undefined>

export function useCreateVote(input: CommentListInput) {
  const queryClient = useQueryClient()
  const queryKey = orpc.comment.list.infiniteKey({ input: () => input, initialPageParam: undefined })

  return useMutation(
    orpc.vote.create.mutationOptions({
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey })

        const previousData = queryClient.getQueryData<CommentListInfiniteData>(queryKey)

        if (previousData) {
          queryClient.setQueryData<CommentListInfiniteData>(queryKey, {
            ...previousData,
            pages: previousData.pages.map((page) => ({
              ...page,
              comments: page.comments.map((comment) => {
                if (comment.id !== newData.id) return comment

                let { likeCount, dislikeCount } = comment
                const liked = newData.isLike

                if (comment.liked === true) likeCount -= 1
                else if (comment.liked === false) dislikeCount -= 1

                if (liked === true) likeCount += 1
                else if (liked === false) dislikeCount += 1

                return { ...comment, liked, likeCount, dislikeCount }
              }),
            })),
          })
        }

        return { previousData }
      },
      onError: (_error, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData)
        }
      },
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey })
      },
    }),
  )
}
