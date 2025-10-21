import { cn } from '@repo/ui/utils/cn'
import { Loader2Icon } from 'lucide-react'

type SpinnerProps = React.ComponentProps<'svg'>

const Spinner = (props: SpinnerProps) => {
  const { className, ...rest } = props

  return <Loader2Icon role='status' aria-label='Loading' className={cn('size-4 animate-spin', className)} {...rest} />
}

export { Spinner }
