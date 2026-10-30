import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { AccountLayout } from '@/features/account/account-layout'
import { getAccountUser } from '@/features/auth/auth.functions'

export const Route = createFileRoute('/_main/account')({
  beforeLoad: async () => {
    const user = await getAccountUser()

    if (!user) throw redirect({ to: '/' })

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
    <AccountLayout>
      <Outlet />
    </AccountLayout>
  )
}
