import type { ViewCountInput } from '@/orpc/client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useCountView(input: ViewCountInput) {
  return useQuery(orpc.view.count.queryOptions({ input }))
}

export function useIncrementView(input: ViewCountInput) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.view.increment.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: orpc.view.count.key({ input }),
        })
      },
    }),
  )
}
