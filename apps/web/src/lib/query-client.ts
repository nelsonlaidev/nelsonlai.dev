import { toast } from '@repo/ui/components/toast'
import { QueryCache, QueryClient } from '@tanstack/react-query'

export function createQueryClient() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        toast.add({
          type: 'error',
          description: `Error: ${error.message}`,
          actionProps: {
            children: 'Retry',
            onClick: () => {
              void queryClient.refetchQueries({
                queryKey: query.queryKey,
                exact: true,
                type: 'active',
              })
            },
          },
        })
      },
    }),
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  })

  return queryClient
}
