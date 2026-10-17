'use client'

import { Provider as JotaiProvider } from 'jotai'
import { ThemeProvider } from 'next-themes'

import { Toaster } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'

import { QueryProvider } from './query-provider'

type ProvidesProps = {
  children: React.ReactNode
}

export function Providers(props: ProvidesProps) {
  const { children } = props

  return (
    <JotaiProvider>
      <QueryProvider>
        <ThemeProvider attribute='class' disableTransitionOnChange>
          <TooltipProvider>
            {children}
            <Toaster timeout={2500} limit={5} />
          </TooltipProvider>
        </ThemeProvider>
      </QueryProvider>
    </JotaiProvider>
  )
}
