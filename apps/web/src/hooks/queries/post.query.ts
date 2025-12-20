import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { type Inputs, orpc, type Outputs } from '@/orpc/client'

export function usePostComments(
  input: (pageParam: Date | undefined) => Inputs['posts']['comments']['list'],
  enabled = true
) {
  return useInfiniteQuery(
    orpc.posts.comments.list.infiniteOptions({
      input,
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
      enabled
    })
  )
}

export function usePostViewCount(input: Inputs['posts']['views']['count']) {
  return useQuery(orpc.posts.views.count.queryOptions({ input }))
}

export function usePostCommentCount(input: Inputs['posts']['comments']['count']) {
  return useQuery(orpc.posts.comments.count.queryOptions({ input }))
}

export function usePostReplyCount(input: Inputs['posts']['replies']['count']) {
  return useQuery(orpc.posts.replies.count.queryOptions({ input }))
}

export function usePostLikeCount(input: Inputs['posts']['likes']['count']) {
  return useQuery(orpc.posts.likes.count.queryOptions({ input }))
}

export function useIncrementPostViewCount(input: Inputs['posts']['views']['count']) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.posts.views.increment.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.posts.views.count.key({ input })
        })
      }
    })
  )
}

type PostLikeCountOutput = Outputs['posts']['likes']['count']

export function useLikePost(input: Inputs['posts']['likes']['count']) {
  const queryClient = useQueryClient()
  const queryKey = orpc.posts.likes.count.queryKey({ input: { slug: input.slug } })

  return useMutation(
    orpc.posts.likes.increment.mutationOptions({
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey })

        const previousData = queryClient.getQueryData<PostLikeCountOutput>(queryKey)

        if (previousData) {
          queryClient.setQueryData<PostLikeCountOutput>(queryKey, {
            ...previousData,
            likes: previousData.likes + newData.value,
            currentUserLikes: previousData.currentUserLikes + newData.value
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
        queryClient.invalidateQueries({ queryKey: orpc.posts.likes.count.key({ input }) })
      }
    })
  )
}

export function useVotePostComment(input: Inputs['posts']['comments']['list']) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.posts.votes.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.posts.comments.list.key({ input }) })
      }
    })
  )
}

export function useCreatePostComment(input: Inputs['posts']['comments']['list'], onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.posts.comments.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.posts.comments.list.key({ input }) })
        queryClient.invalidateQueries({ queryKey: orpc.posts.comments.count.key({ input }) })
        queryClient.invalidateQueries({ queryKey: orpc.posts.replies.count.key({ input }) })
        onSuccess?.()
      }
    })
  )
}

export function useDeletePostComment(input: Inputs['posts']['comments']['list'], onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.posts.comments.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.posts.comments.list.key({ input }) })
        queryClient.invalidateQueries({ queryKey: orpc.posts.comments.count.key({ input }) })
        queryClient.invalidateQueries({ queryKey: orpc.posts.replies.count.key({ input }) })
        onSuccess?.()
      }
    })
  )
}
