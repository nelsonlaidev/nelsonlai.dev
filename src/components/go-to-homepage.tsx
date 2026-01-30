'use client'

import { useTranslations } from 'next-intl'

import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/components/ui/link'

function GoToHomepage() {
  const t = useTranslations()

  return (
    <Link href='/' className={buttonVariants()}>
      {t('components.go-to-homepage')}
    </Link>
  )
}

export default GoToHomepage
