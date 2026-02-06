import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { getTranslations } from 'next-intl/server'

import ActiveSessions from '@/components/account/active-sessions'
import Profile from '@/components/account/profile'
import { createMetadata } from '@/lib/metadata'

export async function generateMetadata(props: PageProps<'/[locale]/account'>): Promise<Metadata> {
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
  })
}

function Page() {
  return (
    <>
      <Profile />
      <ActiveSessions />
    </>
  )
}

export default Page
