import type { Locale } from 'next-intl'

import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import MainLayout from '@/components/main-layout'

function Layout(props: LayoutProps<'/[locale]'>) {
  const { children, params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  return <MainLayout>{children}</MainLayout>
}

export default Layout
