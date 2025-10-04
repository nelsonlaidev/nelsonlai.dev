import { routing } from '@repo/i18n/routing'
import { SidebarProvider } from '@repo/ui/components/sidebar'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'

import AdminHeader from '@/components/admin/admin-header'
import AdminSidebar from '@/components/admin/admin-sidebar'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return routing.locales.map((locale) => ({ locale }))
}

const Layout = async (props: LayoutProps<'/[locale]'>) => {
  const { children, params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className='flex w-full flex-col overflow-x-hidden px-4'>
        <AdminHeader />
        <main className='py-6'>{children}</main>
      </div>
    </SidebarProvider>
  )
}

export default Layout
