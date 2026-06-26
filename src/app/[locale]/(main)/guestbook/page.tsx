import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import { MessageBoard } from '@/components/guestbook/message-board'
import { JsonLd } from '@/components/json-ld'
import { PageHeader } from '@/components/page-header'
import { getSite } from '@/lib/content'
import { createJsonLdWebPage } from '@/lib/json-ld'
import { createPageMetadata } from '@/lib/metadata'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(props: PageProps<'/[locale]/guestbook'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const page = getSite('guestbook', locale)

  if (!page) return {}

  return createPageMetadata({
    title: page.title,
    description: page.description,
    canonical: '/guestbook',
    openGraphImage: page.opengraphImage.url,
    locale: locale as Locale,
  })
}

function Page(props: PageProps<'/[locale]/guestbook'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const page = getSite('guestbook', locale)
  const url = getLocalizedPath('/guestbook', locale as Locale)

  if (!page) notFound()

  const { title, description } = page

  const jsonLd = createJsonLdWebPage({ title, description, url, locale: locale as Locale })

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />
      <MessageBoard />
    </>
  )
}

export default Page
