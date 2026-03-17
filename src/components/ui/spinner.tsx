import { LoaderIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

type SpinnerProps = React.ComponentProps<'svg'>

export function Spinner(props: SpinnerProps) {
  const { className, ...rest } = props
  const t = useTranslations()

  return (
    <LoaderIcon
      role='status'
      aria-label={t('common.aria-labels.loading')}
      className={cn('size-4 animate-spin', className)}
      {...rest}
    />
  )
}
