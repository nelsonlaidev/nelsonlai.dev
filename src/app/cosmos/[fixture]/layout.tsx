import '@/styles/globals.css'

import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'

import { Toaster } from '@/components/ui/sonner'

function Layout(props: LayoutProps<'/cosmos/[fixture]'>) {
  const { children } = props

  return (
    <html lang='en' data-scroll-behavior='smooth' suppressHydrationWarning>
      <body>
        <NextIntlClientProvider>
          <ThemeProvider attribute='class' disableTransitionOnChange enableSystem={false} defaultTheme='light'>
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default Layout
