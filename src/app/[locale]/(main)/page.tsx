import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import { AboutMe } from '@/components/home/about-me'
import { GetInTouch } from '@/components/home/get-in-touch'
import { Hero } from '@/components/home/hero'
import { LatestArticles } from '@/components/home/latest-articles'
import { SelectedProjects } from '@/components/home/selected-projects'
import { JsonLd } from '@/components/json-ld'
import { getLatestPosts, getSelectedProjects } from '@/lib/content'
import { createJsonLdWebSite } from '@/lib/json-ld'
import { createPageMetadata } from '@/lib/metadata'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(props: PageProps<'/[locale]'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const t = await getTranslations({ locale: locale as Locale })
  const description = t('metadata.site-description')

  return createPageMetadata({
    title: null,
    description,
    canonical: '/',
    openGraphImage: null,
    locale: locale as Locale,
  })
}

function Page(props: PageProps<'/[locale]'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const t = useTranslations()
  const url = getLocalizedPath('/', locale as Locale)

  const jsonLd = createJsonLdWebSite({
    description: t('metadata.site-description'),
    url,
    locale: locale as Locale,
  })

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
