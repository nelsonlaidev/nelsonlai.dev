import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'

import { JsonLd } from '@/components/json-ld'
import { PageHeader } from '@/components/page-header'
import { Stats } from '@/components/stats'
import { getSite } from '@/lib/content'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { createPageMetadata } from '@/lib/metadata'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  const page = getSite('dashboard', locale)

  if (!page) return {}

  return createPageMetadata({
    title: page.title,
    description: page.description,
    canonical: '/dashboard',
    openGraphImage: page.opengraphImage.url,
    locale,
  })
}

async function Page() {
  const locale = await getLocale()

  const page = getSite('dashboard', locale)
  const url = getLocalizedPath('/dashboard', locale)

  if (!page) notFound()

  const { title, description } = page

  const jsonLd = createJsonLdWebPage({ title, description, url, locale })

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />
      <Stats />
    </>
  )
}

export default Page
