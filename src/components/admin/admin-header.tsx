'use client'

import { useTranslations } from 'next-intl'

import { SidebarTrigger } from '@/components/ui/sidebar'

export function AdminHeader() {
  const t = useTranslations()

  return (
    <header className='flex items-center justify-between py-4'>
      <SidebarTrigger variant='outline' aria-label={t('admin.toggle-sidebar')} />
    </header>
  )
}
