'use client'

import { useTranslations } from '@repo/i18n/client'
import { buttonVariants } from '@repo/ui/components/button'
import { Link } from '@repo/ui/components/link'

const GoToHomepage = () => {
  const t = useTranslations()

  return (
    <Link href='/' className={buttonVariants()}>
      {t('component.go-to-homepage')}
    </Link>
  )
}

export default GoToHomepage
