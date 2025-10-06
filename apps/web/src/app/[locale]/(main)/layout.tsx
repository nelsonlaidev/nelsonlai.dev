import { routing } from '@repo/i18n/routing'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import MainLayout from '@/components/main-layout'

const Layout = async (props: LayoutProps<'/[locale]'>) => {
  const { children, params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return <MainLayout>{children}</MainLayout>
}

export default Layout
