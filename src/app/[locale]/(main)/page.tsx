import type { Metadata } from 'next'

import { getLocale, getTranslations } from 'next-intl/server'

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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  const t = await getTranslations({ locale })
  const description = t('metadata.site-description')

  return createPageMetadata({
    title: null,
    description,
    canonical: '/',
    openGraphImage: null,
    locale,
  })
}

async function Page() {
  const locale = await getLocale()

  const t = await getTranslations()
  const url = getLocalizedPath('/', locale)

  const jsonLd = createJsonLdWebSite({
    description: t('metadata.site-description'),
    url,
    locale,
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
