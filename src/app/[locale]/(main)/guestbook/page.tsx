import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'

import { MessageBoard } from '@/components/guestbook/message-board'
import { JsonLd } from '@/components/json-ld'
import { PageHeader } from '@/components/page-header'
import { getSite } from '@/lib/content'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { createPageMetadata } from '@/lib/metadata'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  const page = getSite('guestbook', locale)

  if (!page) return {}

  return createPageMetadata({
    title: page.title,
    description: page.description,
    canonical: '/guestbook',
    openGraphImage: page.opengraphImage.url,
    locale,
  })
}

async function Page() {
  const locale = await getLocale()

  const page = getSite('guestbook', locale)
  const url = getLocalizedPath('/guestbook', locale)

  if (!page) notFound()

  const { title, description } = page

  const jsonLd = createJsonLdWebPage({ title, description, url, locale })

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />
      <MessageBoard />
    </>
  )
}

export default Page
