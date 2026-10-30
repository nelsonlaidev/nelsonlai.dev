import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { NotFound } from '@/components/not-found'
import { RouteError } from '@/components/route-error'
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
  errorComponent: RouteError,
  notFoundComponent: NotFound,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
