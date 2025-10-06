import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { getTranslations } from '@repo/i18n/server'
import { redirect } from 'next/navigation'

import ActiveSessions from '@/components/account/active-sessions'
import Profile from '@/components/account/profile'
import PageHeader from '@/components/page-header'
import { getSession } from '@/lib/auth'
import { createMetadata } from '@/lib/metadata'

export const generateMetadata = async (props: PageProps<'/[locale]/account'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params

  const t = await getTranslations({ locale: locale as Locale })
  const title = t('common.labels.account')
  const description = t('account.description')

  return createMetadata({
    pathname: '/account',
    title,
    description,
    locale,
    ogImagePathname: '/account/og-image.png'
  })
}

const Page = async () => {
  const session = await getSession()

  if (!session || session.user.role !== 'admin') {
    redirect('/')
  }

  const t = await getTranslations()
  const title = t('common.labels.account')
  const description = t('account.description')

  return (
    <>
      <PageHeader title={title} description={description} />
      <div className='space-y-12'>
        <Profile />
        <ActiveSessions />
      </div>
    </>
  )
}

export default Page
