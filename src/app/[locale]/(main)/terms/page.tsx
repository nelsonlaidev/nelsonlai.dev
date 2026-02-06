import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import { type Locale, useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import Mdx from '@/components/mdx'
import PageHeader from '@/components/page-header'
import { getPageBySlug } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'

export async function generateMetadata(props: PageProps<'/[locale]/terms'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const t = await getTranslations({ locale: locale as Locale })
  const title = t('common.labels.terms')
  const description = t('terms.description')

  return createMetadata({
    pathname: '/terms',
    title,
    description,
    locale,
  })
}

function Page(props: PageProps<'/[locale]/terms'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const t = useTranslations()
  const title = t('common.labels.terms')
  const description = t('terms.description')
  const page = getPageBySlug(locale, 'terms')

  if (!page) {
    return notFound()
  }

  const { code } = page

  return (
    <>
      <PageHeader title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page
