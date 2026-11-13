import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { AdminLayout } from '@/features/admin/admin-layout'
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
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
