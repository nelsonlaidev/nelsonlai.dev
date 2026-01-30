'use client'

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'
import { toast } from 'sonner'

function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error(error.message)
      }
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        toast.error(error.message)
      }
    })
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
