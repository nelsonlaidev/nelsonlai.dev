import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import { JsonLd } from '@/components/json-ld'
import { PageHeader } from '@/components/page-header'
import { Stats } from '@/components/stats'
import { getSite } from '@/lib/content'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { createPageMetadata } from '@/lib/metadata'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(props: PageProps<'/[locale]/dashboard'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const page = getSite('dashboard', locale)

  if (!page) return {}

  return createPageMetadata({
    title: page.title,
    description: page.description,
    canonical: '/dashboard',
    openGraphImage: page.opengraphImage.url,
    locale: locale as Locale,
  })
}

function Page(props: PageProps<'/[locale]/dashboard'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const page = getSite('dashboard', locale)
  const url = getLocalizedPath('/dashboard', locale as Locale)

  if (!page) notFound()

  const { title, description } = page

  const jsonLd = createJsonLdWebPage({ title, description, url, locale: locale as Locale })

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />
      <Stats />
    </>
  )
}

export default Page
