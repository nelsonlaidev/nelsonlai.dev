import { Skeleton } from '@repo/ui/components/skeleton'
import { cn } from '@repo/ui/utils/cn'

import { range } from '@/utils/range'

const Placeholder = () => (
  <div className='rounded-lg border p-4 shadow-xs dark:bg-zinc-900/30'>
    <div className='mb-3 flex gap-3'>
      <Skeleton className='size-10 rounded-full' />
      <div className='flex flex-col justify-center gap-1'>
        <Skeleton className='h-4 w-40 rounded-md' />
        <Skeleton className='h-4 w-36 rounded-md' />
      </div>
    </div>
    <Skeleton className='h-6 w-full max-w-xs rounded-md pl-13' />
  </div>
)

const MessagesLoader = (props: React.ComponentProps<'div'>) => {
  const { className, ...rest } = props

  return (
    <div className={cn('flex flex-col gap-4', className)} {...rest}>
      {range(8).map((number) => (
        <Placeholder key={number} />
      ))}
    </div>
  )
}

export default MessagesLoader
