import type { Metadata } from 'next'

import { getLocale, getTranslations } from 'next-intl/server'

import { ActiveSessions } from '@/components/account/active-sessions'
import { Profile } from '@/components/account/profile'
import { createPageMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  const t = await getTranslations({ locale })
  const title = t('common.labels.account')
  const description = t('account.description')

  return createPageMetadata({
    title,
    description,
    canonical: '/account',
    locale,
    openGraphImage: null,
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
