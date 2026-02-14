import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useGetSettings() {
  return useQuery(orpc.settings.get.queryOptions())
}

export function useUpdateSettings(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.settings.update.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.settings.get.key() })
        onSuccess?.()
      },
    }),
  )
}
