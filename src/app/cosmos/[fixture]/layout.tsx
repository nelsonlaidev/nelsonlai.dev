import '@/styles/globals.css'

import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'

import { QueryProvider } from '@/components/query-provider'
import { Toaster } from '@/components/ui/sonner'

function Layout(props: LayoutProps<'/cosmos/[fixture]'>) {
  const { children } = props

  setRequestLocale('en')

  return (
    <html lang='en' data-scroll-behavior='smooth' suppressHydrationWarning>
      <body>
        <QueryProvider>
          <NextIntlClientProvider>
            <ThemeProvider attribute='class' disableTransitionOnChange enableSystem={false} defaultTheme='light'>
              {children}
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

export default Layout
