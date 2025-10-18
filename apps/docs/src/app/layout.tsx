import '@/styles/globals.css'

import { cn } from '@repo/ui/utils/cn'
import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { Geist, Geist_Mono } from 'next/font/google'

import { source } from '@/lib/source'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

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
          <DocsLayout tree={source.pageTree}>{children}</DocsLayout>
        </RootProvider>
      </body>
    </html>
  )
}

export default Layout
