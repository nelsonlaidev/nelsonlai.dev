import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { notFound } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import { JsonLd } from '@/components/json-ld'
import { Mdx } from '@/components/mdx'
import { PageHeader } from '@/components/page-header'
import { getSite } from '@/lib/content'
import { createJsonLdAboutPage } from '@/lib/json-ld'
import { createPageMetadata } from '@/lib/metadata'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(props: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const page = getSite('about', locale)

  if (!page) return {}

  return createPageMetadata({
    title: page.title,
    description: page.description,
    canonical: '/about',
    openGraphImage: page.opengraphImage.url,
    locale: locale as Locale,
  })
}

function Page(props: PageProps<'/[locale]/about'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const t = useTranslations()

  const page = getSite('about', locale)
  const url = getLocalizedPath('/about', locale as Locale)

  if (!page) notFound()

  const { title, description, code } = page

  const jsonLd = createJsonLdAboutPage({
    title,
    description,
    url,
    siteDescription: t('metadata.site-description'),
    locale: locale as Locale,
  })

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page
