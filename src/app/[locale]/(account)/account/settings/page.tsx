import type { Metadata } from 'next'

import { getLocale, getTranslations } from 'next-intl/server'

import { Settings } from '@/components/settings'
import { createPageMetadata } from '@/lib/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  const t = await getTranslations({ locale })
  const title = t('common.labels.settings')
  const description = t('settings.description')

  return createPageMetadata({
    title,
    description,
    canonical: '/account/settings',
    openGraphImage: null,
    locale,
  })
}

function Page() {
  return <Settings />
}

export default Page
