import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { getTranslations } from 'next-intl/server'

import Settings from '@/components/settings'
import { createMetadata } from '@/lib/metadata'

export async function generateMetadata(props: PageProps<'/[locale]/account/settings'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const t = await getTranslations({ locale: locale as Locale })
  const title = t('common.labels.settings')
  const description = t('settings.description')

  return createMetadata({
    pathname: '/account/settings',
    title,
    description,
    locale,
  })
}

function Page() {
  return <Settings />
}

export default Page
