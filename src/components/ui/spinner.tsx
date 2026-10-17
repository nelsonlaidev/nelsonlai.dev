import { cn } from 'cn'
import { LoaderCircleIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

type SpinnerProps = React.ComponentProps<'svg'>

export function Spinner(props: SpinnerProps) {
  const { className, ...rest } = props
  const t = useTranslations()

  return (
    <LoaderCircleIcon
      data-slot='spinner'
      // Expose the SVG spinner as a loading status.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role='status'
      aria-label={t('common.aria-labels.loading')}
      className={cn('size-4 animate-spin motion-reduce:animate-none', className)}
      {...rest}
    />
  )
}
