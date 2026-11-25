import { OceanPage } from '@/components/ocean-page'
import { PageHeader } from '@/components/page-header'
import { m } from '@/paraglide/messages'

import { AccountMobileNav, AccountSidebar } from './account-nav'

type AccountLayoutProps = {
  children: React.ReactNode
}

export function AccountLayout(props: AccountLayoutProps) {
  const { children } = props

  return (
    <OceanPage>
      <div className='flex items-start justify-between'>
        <PageHeader title={m.common_labels_account()} description={m.account_description()} />
        <AccountMobileNav />
      </div>
      <div className='gap-12 md:flex'>
        <AccountSidebar />
        <div className='min-w-0 flex-1 space-y-12'>{children}</div>
      </div>
    </OceanPage>
  )
}
