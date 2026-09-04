'use client'

import { cn } from 'cn'
import { useTranslations } from 'next-intl'

import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/components/ui/link'

export function GoToHomepage() {
  const t = useTranslations()

  return (
    <Link href='/' className={cn(buttonVariants())}>
      {t('components.go-to-homepage')}
    </Link>
  )
}
