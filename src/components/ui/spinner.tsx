import { LoaderIcon } from 'lucide-react'

import { cn } from '@/utils/cn'

type SpinnerProps = React.ComponentProps<'svg'>

function Spinner(props: SpinnerProps) {
  const { className, ...rest } = props

  return <LoaderIcon role='status' aria-label='Loading' className={cn('size-4 animate-spin', className)} {...rest} />
}

export { Spinner }
