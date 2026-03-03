'use client'

import { useTranslations } from 'next-intl'

import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { cn } from '@/utils/cn'

export function GoToHomepage() {
  const t = useTranslations()

  return (
    <Link href='/' className={cn(buttonVariants())}>
      {t('components.go-to-homepage')}
    </Link>
  )
}
