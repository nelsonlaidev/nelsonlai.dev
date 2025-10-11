import type { Locale } from 'next-intl'

import { redirect } from '@repo/i18n/routing'
import { getTranslations } from 'next-intl/server'

import AccountSidebar from '@/components/account/account-sidebar'
import MainLayout from '@/components/main-layout'
import PageHeader from '@/components/page-header'
import { getSession } from '@/lib/auth'

const Layout = async (props: LayoutProps<'/[locale]'>) => {
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
      <PageHeader title={title} description={description} />
      <div className='gap-10 md:flex'>
        <AccountSidebar />
        <div className='w-full space-y-12'>{children}</div>
      </div>
    </MainLayout>
  )
}

export default Layout
