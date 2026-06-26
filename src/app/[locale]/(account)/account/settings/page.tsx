import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { getTranslations } from 'next-intl/server'

import { Settings } from '@/components/settings'
import { createPageMetadata } from '@/lib/metadata'

export async function generateMetadata(props: PageProps<'/[locale]/account/settings'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const t = await getTranslations({ locale: locale as Locale })
  const title = t('common.labels.settings')
  const description = t('settings.description')

  return createPageMetadata({
    title,
    description,
    canonical: '/account/settings',
    openGraphImage: null,
    locale: locale as Locale,
  })
}

function Page() {
  return <Settings />
}

export default Page
