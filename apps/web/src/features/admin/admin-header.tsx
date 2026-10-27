import { SidebarTrigger } from '@repo/ui/components/sidebar'

import { m } from '@/paraglide/messages'
import { LocaleSwitcher } from '@/routes/_main/-components/locale-switcher'
import { ThemeSwitcher } from '@/routes/_main/-components/theme-switcher'

export function AdminHeader() {
  return (
    <header className='flex items-center justify-between py-4'>
      <SidebarTrigger variant='outline' aria-label={m.admin_toggle_sidebar()} />
      <div className='flex items-center gap-2'>
        <ThemeSwitcher />
        <LocaleSwitcher />
      </div>
    </header>
  )
}
