import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { type LikeCountInput, type LikeCountOutput, orpc } from '@/orpc/client'

export function useCountLike(input: LikeCountInput) {
  return useQuery(orpc.like.count.queryOptions({ input }))
}

export function useIncrementLike(input: LikeCountInput) {
  const queryClient = useQueryClient()
  const queryKey = orpc.like.count.queryKey({ input: { slug: input.slug } })

  return useMutation(
    orpc.like.increment.mutationOptions({
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey })

        const previousData = queryClient.getQueryData<LikeCountOutput>(queryKey)

        if (previousData) {
          queryClient.setQueryData<LikeCountOutput>(queryKey, {
            ...previousData,
            likes: previousData.likes + newData.value,
            currentUserLikes: previousData.currentUserLikes + newData.value,
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
        void queryClient.invalidateQueries({ queryKey: orpc.like.count.key({ input }) })
      },
    }),
  )
}
