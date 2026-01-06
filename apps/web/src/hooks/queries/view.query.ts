import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orpc, type ViewCountInput } from '@/orpc/client'

export function usePostViewCount(input: ViewCountInput) {
  return useQuery(orpc.view.count.queryOptions({ input }))
}

export function useIncrementPostViewCount(input: ViewCountInput) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.view.increment.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.view.count.key({ input })
        })
      }
    })
  )
}
