import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'

import { type Locale, useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import MessageBoard from '@/components/guestbook/message-board'
import JsonLd from '@/components/json-ld'
import PageHeader from '@/components/page-header'
import { MY_NAME } from '@/lib/constants'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(props: PageProps<'/[locale]/guestbook'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const t = await getTranslations({ locale: locale as Locale })
  const title = t('common.labels.guestbook')
  const description = t('guestbook.description')

  return createMetadata({
    pathname: '/guestbook',
    title,
    description,
    locale,
  })
}

function Page(props: PageProps<'/[locale]/guestbook'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const t = useTranslations()
  const title = t('common.labels.guestbook')
  const description = t('guestbook.description')
  const url = getLocalizedPath({ locale, pathname: '/guestbook' })

  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: MY_NAME,
      url: getBaseUrl(),
    },
    inLanguage: locale,
  }

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />
      <MessageBoard />
    </>
  )
}

export default Page
