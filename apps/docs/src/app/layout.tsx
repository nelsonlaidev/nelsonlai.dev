import type { Metadata } from 'next'

import '@/styles/globals.css'

import { Toaster } from '@repo/ui/components/sonner'
import { cn } from '@repo/ui/utils/cn'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { Geist, Geist_Mono } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: {
    template: '%s | @nelsonlaidev/docs',
    default: '@nelsonlaidev/docs'
  },
  description: "Documentation for Nelson Lai's projects and libraries.",
  icons: {
    icon: {
      rel: 'icon',
      type: 'image/x-icon',
      url: 'https://nelsonlai.dev/favicon.ico'
    }
  }
}

const Layout = (props: LayoutProps<'/'>) => {
  const { children } = props

  return (
    <html
      lang='en'
      className={cn(geistSans.variable, geistMono.variable)}
      data-scroll-behavior='smooth'
      suppressHydrationWarning
    >
      <body className='flex min-h-screen flex-col'>
        <RootProvider>
          {children}
          <Toaster />
        </RootProvider>
      </body>
    </html>
  )
}

export default Layout
