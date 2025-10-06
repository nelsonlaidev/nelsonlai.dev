import type { Metadata } from 'next'

import { routing } from '@repo/i18n/routing'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'

import Mdx from '@/components/mdx'
import PageHeader from '@/components/page-header'
import { getPageBySlug } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'

export const generateMetadata = async (props: PageProps<'/[locale]/privacy'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    return {}
  }

  const t = await getTranslations({ locale })
  const title = t('common.labels.privacy-policy')
  const description = t('privacy.description')

  return createMetadata({
    pathname: '/privacy',
    title,
    description,
    locale,
    ogImagePathname: '/privacy/og-image.png'
  })
}

const Page = async (props: PageProps<'/[locale]/privacy'>) => {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const t = await getTranslations()
  const title = t('common.labels.privacy-policy')
  const description = t('privacy.description')
  const page = getPageBySlug(locale, 'privacy')

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
