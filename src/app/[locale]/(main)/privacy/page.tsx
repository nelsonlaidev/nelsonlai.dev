import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import { JsonLd } from '@/components/json-ld'
import { Mdx } from '@/components/mdx'
import { PageHeader } from '@/components/page-header'
import { getSite } from '@/lib/content'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { createPageMetadata } from '@/lib/metadata'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(props: PageProps<'/[locale]/privacy'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const page = getSite('privacy', locale)

  if (!page) return {}

  return createPageMetadata({
    title: page.title,
    description: page.description,
    canonical: '/privacy',
    openGraphImage: page.opengraphImage.url,
    locale: locale as Locale,
  })
}

function Page(props: PageProps<'/[locale]/privacy'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const page = getSite('privacy', locale)

  if (!page) notFound()

  const url = getLocalizedPath('/privacy', locale as Locale)
  const { title, description, code } = page

  const jsonLd = createJsonLdWebPage({ title, description, url, locale: locale as Locale })

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page
