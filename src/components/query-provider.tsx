'use client'

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import posthog from 'posthog-js'
import { useState } from 'react'
import { toast } from 'sonner'

function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        toast.error(error.message)

        posthog.captureException(error, {
          type: 'query',
          queryKey: query.queryKey,
        })
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        toast.error(error.message)

        posthog.captureException(error, {
          type: 'mutation',
          mutationKey: mutation.options.mutationKey,
        })
      },
    }),
  })
}

type QueryProviderProps = {
  children: React.ReactNode
}

function QueryProvider(props: QueryProviderProps) {
  const { children } = props
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}

export default QueryProvider
