import { getLocale } from 'next-intl/server'

import { AdminHeader } from '@/components/admin/admin-header'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { redirect } from '@/i18n/navigation'
import { getSession } from '@/lib/auth'

async function Layout(props: LayoutProps<'/[locale]'>) {
  const { children } = props
  const locale = await getLocale()
  const session = await getSession()

  if (session?.user.role !== 'admin') {
    redirect({ href: '/', locale })
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className='flex w-full flex-col overflow-x-hidden px-4 pb-22'>
        <AdminHeader />
        <main className='py-6'>{children}</main>
      </div>
    </SidebarProvider>
  )
}

export default Layout
