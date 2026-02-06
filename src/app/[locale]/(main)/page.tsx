import type { Metadata } from 'next'
import type { WebSite, WithContext } from 'schema-dts'

import { type Locale, useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import AboutMe from '@/components/home/about-me'
import GetInTouch from '@/components/home/get-in-touch'
import Hero from '@/components/home/hero'
import LatestArticles from '@/components/home/latest-articles'
import SelectedProjects from '@/components/home/selected-projects'
import JsonLd from '@/components/json-ld'
import {
  MY_NAME,
  SITE_FACEBOOK_URL,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL,
} from '@/lib/constants'
import { getLatestPosts, getSelectedProjects } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(props: PageProps<'/[locale]'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const t = await getTranslations({ locale: locale as Locale })
  const description = t('metadata.site-description')

  return createMetadata({
    root: true,
    title: MY_NAME,
    description,
    locale,
  })
}

function Page(props: PageProps<'/[locale]'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const t = useTranslations()
  const url = getLocalizedPath({ locale })

  const jsonLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': url,
    name: MY_NAME,
    description: t('metadata.site-description'),
    url,
    publisher: {
      '@type': 'Person',
      name: MY_NAME,
      url: getBaseUrl(),
      sameAs: [SITE_FACEBOOK_URL, SITE_INSTAGRAM_URL, SITE_X_URL, SITE_GITHUB_URL, SITE_YOUTUBE_URL],
    },
    copyrightYear: new Date().getFullYear(),
    dateCreated: '2022-02-01T00:00:00Z',
    dateModified: new Date().toISOString(),
    inLanguage: locale,
  }

  const filteredPosts = getLatestPosts(locale, 2)
  const filteredProjects = getSelectedProjects(locale)

  return (
    <>
      <JsonLd json={jsonLd} />
      <Hero />
      <SelectedProjects projects={filteredProjects} />
      <AboutMe />
      <LatestArticles posts={filteredPosts} />
      <GetInTouch />
    </>
  )
}

export default Page
