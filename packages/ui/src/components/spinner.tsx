import { Loader2Icon } from 'lucide-react'

import { cn } from '../utils/cn'

type SpinnerProps = React.ComponentProps<'svg'>

const Spinner = (props: SpinnerProps) => {
  const { className, ...rest } = props

  return <Loader2Icon role='status' aria-label='Loading' className={cn('size-4 animate-spin', className)} {...rest} />
}

export { Spinner }
