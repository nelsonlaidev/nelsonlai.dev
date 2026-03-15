'use client'

import { useTranslations } from 'next-intl'

import { SidebarTrigger } from '@/components/ui/sidebar'

import { LocaleSwitcher } from '../layout/locale-switcher'
import { ThemeSwitcher } from '../layout/theme-switcher'

export function AdminHeader() {
  const t = useTranslations()

  return (
    <header className='flex items-center justify-between py-4'>
      <SidebarTrigger variant='outline' aria-label={t('admin.toggle-sidebar')} />
      <div className='flex items-center gap-2'>
        <ThemeSwitcher />
        <LocaleSwitcher />
      </div>
    </header>
  )
}
