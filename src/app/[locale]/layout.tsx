import '@/styles/globals.css'

import type { Metadata, Viewport } from 'next'

import { SpeedInsights } from '@vercel/speed-insights/next'
import { cn } from 'cn'
import { Geist, Geist_Mono, Noto_Sans_SC, Noto_Sans_TC } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { Analytics } from '@/components/analytics'
import { Hello } from '@/components/hello'
import { Providers } from '@/components/providers'
import { SignInDialog } from '@/components/sign-in-dialog'
import { MY_NAME } from '@/constants/site'
import { routing } from '@/i18n/routing'
import { createRootMetadata } from '@/lib/metadata'

export function generateStaticParams(): Array<{ locale: string }> {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = createRootMetadata({
  title: {
    template: `%s | ${MY_NAME}`,
    default: MY_NAME,
  },
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const notoSansTC = Noto_Sans_TC({
  variable: '--font-noto-sans-tc',
  subsets: ['latin'],
})

const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  subsets: ['latin'],
})

async function Layout(props: LayoutProps<'/[locale]'>) {
  const { children } = props
  const locale = await getLocale()

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html
      lang={locale}
      className={cn(geistSans.variable, geistMono.variable, notoSansTC.variable, notoSansSC.variable)}
      data-scroll-behavior='smooth'
      suppressHydrationWarning
    >
      <body>
        <NuqsAdapter>
          <Providers>
            <NextIntlClientProvider>
              <Hello />
              {children}
              <Analytics />
              <SignInDialog />
            </NextIntlClientProvider>
          </Providers>
        </NuqsAdapter>
        <SpeedInsights />
      </body>
    </html>
  )
}

export default Layout
