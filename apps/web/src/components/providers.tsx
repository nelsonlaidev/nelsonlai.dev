'use client'

import { Toaster } from '@repo/ui/components/sonner'
import { TooltipProvider } from '@repo/ui/components/tooltip'
import { ThemeProvider } from 'next-themes'

import QueryProvider from './query-provider'

type ProvidesProps = {
  children: React.ReactNode
}

function Providers(props: ProvidesProps) {
  const { children } = props

  return (
    <QueryProvider>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem enableColorScheme disableTransitionOnChange>
        <TooltipProvider>
          {children}
          <Toaster
            toastOptions={{
              duration: 2500
            }}
            visibleToasts={5}
            expand
          />
        </TooltipProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}

export default Providers
