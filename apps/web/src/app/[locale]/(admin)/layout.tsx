import { SidebarProvider } from '@repo/ui/components/sidebar'
import { redirect } from 'next/navigation'

import AdminHeader from '@/components/admin/admin-header'
import AdminSidebar from '@/components/admin/admin-sidebar'
import { getSession } from '@/lib/auth'

const Layout = async (props: LayoutProps<'/[locale]'>) => {
  const { children } = props
  const session = await getSession()

  if (!session || session.user.role !== 'admin') {
    redirect('/')
  }

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
