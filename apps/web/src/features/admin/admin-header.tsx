import { SidebarTrigger } from '@repo/ui/components/sidebar'

import { UserMenu } from '@/features/auth/user-menu'
import { m } from '@/paraglide/messages'
import { LocaleSwitcher } from '@/routes/_main/-components/locale-switcher'

export function AdminHeader() {
  return (
    <header className='flex items-center justify-between gap-3 border-b py-4'>
      <SidebarTrigger variant='outline' aria-label={m.admin_toggle_sidebar()} />
      <div className='flex items-center gap-2'>
        <UserMenu />
        <LocaleSwitcher />
      </div>
    </header>
  )
}
