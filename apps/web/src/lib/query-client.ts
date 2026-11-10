import { toast } from '@repo/ui/components/toast'
import { QueryCache, QueryClient } from '@tanstack/react-query'

import { m } from '@/paraglide/messages'

export function createQueryClient() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (import.meta.env.SSR) return
        if (query.state.data === undefined && query.meta?.initialErrorHandledByBoundary) return

        toast.add({
          type: 'error',
          title: `${m.common_error()}: ${error.message}`,
          actionProps: {
            children: m.common_retry(),
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
