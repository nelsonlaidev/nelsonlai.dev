import { OceanPage } from '@/components/ocean-page'
import { m } from '@/paraglide/messages'

import { AccountMobileNav, AccountSidebar } from './account-nav'

export function AccountLayout(props: { children: React.ReactNode }) {
  return (
    <OceanPage>
      <div>
        <div className='mb-10 flex items-start justify-between gap-4 border-b pb-8'>
          <div className='min-w-0 space-y-4'>
            <h1 className='text-[clamp(36px,5vw,64px)] leading-tight font-[420] tracking-tighter'>
              {m.common_labels_account()}
            </h1>
            <p className='max-w-xl text-base/relaxed text-muted-foreground'>{m.account_description()}</p>
          </div>
          <AccountMobileNav />
        </div>
        <div className='gap-10 md:flex'>
          <AccountSidebar />
          <div className='min-w-0 flex-1 space-y-12'>{props.children}</div>
        </div>
      </div>
    </OceanPage>
  )
}
