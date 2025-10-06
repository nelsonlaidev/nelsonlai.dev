import type { Metadata } from 'next'

import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { type Locale, useTranslations } from 'next-intl'
import { use } from 'react'

import ActiveSessions from '@/components/account/active-sessions'
import Profile from '@/components/account/profile'
import PageHeader from '@/components/page-header'
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

const Page = (props: PageProps<'/[locale]/account'>) => {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const t = useTranslations()
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
