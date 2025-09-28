import type { Metadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'

import { i18n } from '@repo/i18n/config'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { notFound } from 'next/navigation'

import JsonLd from '@/components/json-ld'
import Mdx from '@/components/mdx'
import PageTitle from '@/components/page-title'
import { MY_NAME } from '@/lib/constants'
import { allPages } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps<'/[locale]/uses'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'uses' })
  const title = t('title')
  const description = t('description')
  const page = allPages.find((p) => p.slug === 'uses' && p.locale === locale)

  if (!page) {
    return {}
  }

  return createMetadata({
    pathname: page.pathname,
    title,
    description,
    locale,
    ogImagePathname: page.ogImagePathname
  })
}

const Page = async (props: PageProps<'/[locale]/uses'>) => {
  const { params } = props
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations()
  const title = t('uses.title')
  const description = t('uses.description')
  const page = allPages.find((p) => p.slug === 'uses' && p.locale === locale)

  if (!page) {
    return notFound()
  }

  const { code, pathname } = page
  const url = getLocalizedPath({ locale, pathname })

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

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page
