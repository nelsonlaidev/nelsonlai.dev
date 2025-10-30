import { Progress as ProgressPrimitive } from 'radix-ui'

import { cn } from '../utils/cn'

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root>

const Progress = (props: ProgressProps) => {
  const { className, value, ...rest } = props

  return (
    <ProgressPrimitive.Root
      data-slot='progress'
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
      {...rest}
    >
      <ProgressPrimitive.Indicator
        data-slot='progress-indicator'
        className='size-full flex-1 bg-primary transition-all'
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
