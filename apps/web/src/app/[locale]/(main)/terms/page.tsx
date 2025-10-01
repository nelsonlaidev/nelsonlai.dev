import type { Metadata } from 'next'

import { routing } from '@repo/i18n/routing'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'

import Mdx from '@/components/mdx'
import PageHeader from '@/components/page-header'
import { getPageBySlug } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return routing.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps<'/[locale]/terms'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    return {}
  }

  const t = await getTranslations({ locale, namespace: 'terms' })
  const title = t('title')
  const description = t('description')

  return createMetadata({
    pathname: '/terms',
    title,
    description,
    locale,
    ogImagePathname: '/terms/og-image.png'
  })
}

const Page = async (props: PageProps<'/[locale]/terms'>) => {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const t = await getTranslations()
  const title = t('terms.title')
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
