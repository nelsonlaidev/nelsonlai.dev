import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/utils/cn'
import { range } from '@/utils/range'

function Placeholder() {
  return (
    <div className='rounded-xl border p-4'>
      <div className='mb-3 flex gap-3'>
        <Skeleton className='size-10 rounded-full' />
        <div className='flex flex-col justify-center gap-1'>
          <Skeleton className='h-4 w-40' />
          <Skeleton className='h-4 w-36' />
        </div>
      </div>
      <Skeleton className='h-6 w-full max-w-xs pl-13' />
    </div>
  )
}

function MessagesLoader(props: React.ComponentProps<'div'>) {
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
