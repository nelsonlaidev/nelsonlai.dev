import { SidebarProvider } from '@repo/ui/components/sidebar'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { NotFound } from '@/components/not-found'
import { RouteError } from '@/components/route-error'
import { AdminHeader } from '@/features/admin/admin-header'
import { AdminSidebar } from '@/features/admin/admin-sidebar'
import { getAccountUser } from '@/features/auth/auth.functions'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const user = await getAccountUser()
    if (user?.role !== 'admin') throw redirect({ to: '/' })
    return { user }
  },
  head: () => ({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'googlebot', content: 'noindex, nofollow' },
    ],
  }),
  errorComponent: RouteError,
  notFoundComponent: NotFound,
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className='flex w-full min-w-0 flex-col overflow-x-hidden px-4 pb-22'>
        <AdminHeader />
        <main id='main-content' tabIndex={-1} className='py-6 outline-none'>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
