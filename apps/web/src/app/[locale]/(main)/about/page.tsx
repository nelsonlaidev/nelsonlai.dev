import type { Metadata } from 'next'
import type { AboutPage, WithContext } from 'schema-dts'

import { i18n } from '@repo/i18n/config'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { notFound } from 'next/navigation'

import Mdx from '@/components/mdx'
import PageTitle from '@/components/page-title'
import {
  MY_NAME,
  SITE_FACEBOOK_URL,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL
} from '@/lib/constants'
import { allPages } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps<'/[locale]/about'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  const page = allPages.find((p) => p.slug === 'about' && p.locale === locale)

  if (!page) {
    return {}
  }

  return createMetadata({
    pathname: page.pathname,
    title: t('title'),
    description: t('description'),
    locale,
    ogImagePathname: page.ogImagePathname,
    openGraph: {
      type: 'profile'
    }
  })
}

const Page = async (props: PageProps<'/[locale]/about'>) => {
  const { params } = props
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const title = t('about.title')
  const description = t('about.description')
  const page = allPages.find((p) => p.slug === 'about' && p.locale === locale)

  if (!page) {
    return notFound()
  }

  const { code, pathname } = page
  const url = getLocalizedPath({ locale, pathname })

  const jsonLd: WithContext<AboutPage> = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: title,
    description,
    url,
    mainEntity: {
      '@type': 'Person',
      name: MY_NAME,
      description: t('metadata.site-description'),
      url: getBaseUrl(),
      sameAs: [SITE_FACEBOOK_URL, SITE_INSTAGRAM_URL, SITE_X_URL, SITE_GITHUB_URL, SITE_YOUTUBE_URL]
    },
    inLanguage: locale
  }

  return (
    <>
      {/* eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- Safe */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageTitle title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page
