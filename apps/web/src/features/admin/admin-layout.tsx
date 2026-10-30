import { SidebarProvider } from '@repo/ui/components/sidebar'

import { SignInDialog } from '@/features/auth/sign-in-dialog'
import { SkipNav } from '@/routes/_main/-components/skip-nav'

import { AdminHeader } from './admin-header'
import { AdminSidebar } from './admin-sidebar'

type AdminLayoutProps = {
  children: React.ReactNode
}

export function AdminLayout(props: AdminLayoutProps) {
  const { children } = props

  return (
    <SidebarProvider className='bg-background text-foreground'>
      <SkipNav />
      <AdminSidebar />
      <div className='flex w-full min-w-0 flex-col overflow-x-hidden px-4 pb-22 sm:px-8 lg:px-10'>
        <AdminHeader />
        <main id='main-content' tabIndex={-1} className='py-6 outline-none'>
          {children}
        </main>
      </div>
      <SignInDialog />
    </SidebarProvider>
  )
}
