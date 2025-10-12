'use client'

import { buttonVariants } from '@repo/ui/components/button'
import { Link } from '@repo/ui/components/link'
import { useTranslations } from 'next-intl'

const GoToHomepage = () => {
  const t = useTranslations()

  return (
    <Link href='/' className={buttonVariants()}>
      {t('components.go-to-homepage')}
    </Link>
  )
}

export default GoToHomepage
