import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'

import { routing } from '@repo/i18n/routing'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'

import JsonLd from '@/components/json-ld'
import Mdx from '@/components/mdx'
import PageTitle from '@/components/page-title'
import { MY_NAME } from '@/lib/constants'
import { getPageBySlug } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return routing.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps<'/[locale]/uses'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    return {}
  }

  const t = await getTranslations({ locale, namespace: 'uses' })
  const title = t('title')
  const description = t('description')

  return createMetadata({
    pathname: '/uses',
    title,
    description,
    locale,
    ogImagePathname: '/uses/og-image.png'
  })
}

const Page = async (props: PageProps<'/[locale]/uses'>) => {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const t = await getTranslations()
  const title = t('uses.title')
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
      url: getBaseUrl()
    }
  }

  if (!page) {
    return notFound()
  }

  const { code } = page

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page
