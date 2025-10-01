'use client'

import { SidebarTrigger } from '@repo/ui/components/sidebar'

const AdminHeader = () => {
  return (
    <header className='flex items-center justify-between py-4'>
      <SidebarTrigger variant='outline' />
    </header>
  )
}

export default AdminHeader
