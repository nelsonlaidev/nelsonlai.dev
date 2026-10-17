'use client'

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

import { toast } from '@/components/ui/toast'

function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast.add({ type: 'error', title: error.message })
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        toast.add({ type: 'error', title: error.message })
      },
    }),
  })
}

type QueryProviderProps = {
  children: React.ReactNode
}

export function QueryProvider(props: QueryProviderProps) {
  const { children } = props
  const [queryClient] = useState(() => createQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
