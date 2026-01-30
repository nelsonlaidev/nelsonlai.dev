import type { Locale } from 'next-intl'

import { getTranslations } from 'next-intl/server'

import AccountMobileNav from '@/components/account/account-mobile-nav'
import AccountSidebar from '@/components/account/account-sidebar'
import MainLayout from '@/components/main-layout'
import PageHeader from '@/components/page-header'
import { redirect } from '@/i18n/routing'
import { getSession } from '@/lib/auth'

async function Layout(props: LayoutProps<'/[locale]'>) {
  const { children, params } = props
  const { locale } = await params

  const session = await getSession()

  if (!session) {
    redirect({ href: '/', locale: locale as Locale })
  }

  const t = await getTranslations()
  const title = t('common.labels.account')
  const description = t('account.description')

  return (
    <MainLayout>
      <div className='flex items-center justify-between'>
        <PageHeader title={title} description={description} />
        <AccountMobileNav />
      </div>
      <div className='gap-10 md:flex'>
        <AccountSidebar />
        <div className='w-full space-y-12'>{children}</div>
      </div>
    </MainLayout>
  )
}

export default Layout
