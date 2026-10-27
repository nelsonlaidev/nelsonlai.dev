import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { PageHeader } from '@/components/page-header'
import { AccountMobileNav, AccountSidebar } from '@/features/account/account-nav'
import { getAccountUser } from '@/features/auth/auth.functions'
import { m } from '@/paraglide/messages'

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
    <>
      <div className='flex items-center justify-between gap-4'>
        <PageHeader title={m.common_labels_account()} description={m.account_description()} />
        <AccountMobileNav />
      </div>
      <div className='gap-10 md:flex'>
        <AccountSidebar />
        <div className='min-w-0 flex-1 space-y-12'>
          <Outlet />
        </div>
      </div>
    </>
  )
}
