'use client'

import { SidebarTrigger } from '@repo/ui/components/sidebar'
import { useTranslations } from 'next-intl'

function AdminHeader() {
  const t = useTranslations()

  return (
    <header className='flex items-center justify-between py-4'>
      <SidebarTrigger variant='outline' aria-label={t('admin.toggle-sidebar')} />
    </header>
  )
}

export default AdminHeader
