import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import type { WebPage, WithContext } from 'schema-dts'

import { notFound } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import JsonLd from '@/components/json-ld'
import Mdx from '@/components/mdx'
import PageHeader from '@/components/page-header'
import { MY_NAME } from '@/lib/constants'
import { getPageBySlug } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(props: PageProps<'/[locale]/uses'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const t = await getTranslations({ locale: locale as Locale })
  const title = t('common.labels.uses')
  const description = t('uses.description')

  return createMetadata({
    pathname: '/uses',
    title,
    description,
    locale,
  })
}

function Page(props: PageProps<'/[locale]/uses'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const t = useTranslations()
  const title = t('common.labels.uses')
  const description = t('uses.description')
  const url = getLocalizedPath({ locale, pathname: '/uses' })
  const page = getPageBySlug(locale, 'uses')

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
  }

  if (!page) {
    return notFound()
  }

  const { code } = page

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page
