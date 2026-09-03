import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'

import { JsonLd } from '@/components/json-ld'
import { Mdx } from '@/components/mdx'
import { PageHeader } from '@/components/page-header'
import { getSite } from '@/lib/content'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { createPageMetadata } from '@/lib/metadata'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  const page = getSite('uses', locale)

  if (!page) return {}

  return createPageMetadata({
    title: page.title,
    description: page.description,
    canonical: '/uses',
    openGraphImage: page.opengraphImage.url,
    locale,
  })
}

async function Page() {
  const locale = await getLocale()

  const page = getSite('uses', locale)
  const url = getLocalizedPath('/uses', locale)

  if (!page) notFound()

  const { title, description, code } = page

  const jsonLd = createJsonLdWebPage({ title, description, url, locale })

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page
