import { useTranslations } from 'next-intl'

import { Link } from '../ui/link'

export function SkipNav() {
  const t = useTranslations()

  return (
    <Link
      href={{ hash: 'main-content' }}
      className='fixed left-4 z-50 -translate-y-20 rounded-4xl border bg-background px-3 py-2 font-medium transition-transform focus:outline-none focus-visible:translate-y-0 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2'
    >
      {t('layout.skip-to-main-content')}
    </Link>
  )
}
