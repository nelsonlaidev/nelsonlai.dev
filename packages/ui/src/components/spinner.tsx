import { cn } from 'cn'
import { LoaderCircleIcon } from 'lucide-react'

import { useUITranslation } from './ui-provider'

type SpinnerProps = React.ComponentProps<'svg'>

export function Spinner(props: SpinnerProps) {
  const { className, 'aria-label': ariaLabel, ...rest } = props
  const isHidden = rest['aria-hidden'] === true || rest['aria-hidden'] === 'true'
  const label = useUITranslation('loading', ariaLabel, !isHidden && !rest['aria-labelledby'])

  return (
    <LoaderCircleIcon
      data-slot='spinner'
      // Expose the SVG spinner as a loading status.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role='status'
      aria-label={label}
      className={cn('size-4 animate-spin motion-reduce:animate-none', className)}
      {...rest}
    />
  )
}
