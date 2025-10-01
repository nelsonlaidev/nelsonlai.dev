import type { Metadata } from 'next'

import { routing } from '@repo/i18n/routing'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { notFound } from 'next/navigation'
import { hasLocale } from 'next-intl'

import PageHeader from '@/components/page-header'
import { createMetadata } from '@/lib/metadata'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return routing.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps<'/[locale]/account'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    return {}
  }

  const t = await getTranslations({ locale })
  const title = t('common.labels.account')
  const description = t('account.description')

  return createMetadata({
    pathname: '/account',
    title,
    description,
    locale,
    ogImagePathname: '/account/og-image.png'
  })
}

const Page = async (props: PageProps<'/[locale]/account'>) => {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const t = await getTranslations()
  const title = t('common.labels.account')
  const description = t('account.description')

  return (
    <>
      <PageHeader title={title} description={description} />
      <div className='text-muted-foreground'>WIP</div>
    </>
  )
}

export default Page
