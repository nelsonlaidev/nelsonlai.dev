import { cn } from 'cn'
import { LoaderCircleIcon } from 'lucide-react'

type SpinnerProps = React.ComponentProps<'svg'>

export function Spinner(props: SpinnerProps) {
  const { className, ...rest } = props

  return (
    <LoaderCircleIcon
      data-slot='spinner'
      // Expose the SVG spinner as a loading status.
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
      role='status'
      aria-label='Loading'
      className={cn('size-4 animate-spin motion-reduce:animate-none', className)}
      {...rest}
    />
  )
}
