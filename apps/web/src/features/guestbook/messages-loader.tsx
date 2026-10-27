import { Skeleton } from '@repo/ui/components/skeleton'
import { createRange } from '@repo/utils'
import { cn } from 'cn'

function Placeholder() {
  return (
    <div className='rounded-xl border p-4'>
      <div className='mb-3 flex gap-3'>
        <Skeleton className='size-10 shrink-0 rounded-full' />
        <div className='flex min-w-0 flex-1 flex-col justify-center gap-2'>
          <Skeleton className='h-4 w-full max-w-40' />
          <Skeleton className='h-3 w-full max-w-36' />
        </div>
      </div>
      <div className='pl-13'>
        <Skeleton className='h-6 w-full max-w-xs' />
      </div>
    </div>
  )
}

type MessagesLoaderProps = React.ComponentProps<'div'>

export function MessagesLoader(props: MessagesLoaderProps) {
  const { className, ...rest } = props

  return (
    <div className={cn('flex flex-col gap-4', className)} {...rest}>
      {createRange(8).map((number) => (
        <Placeholder key={number} />
      ))}
    </div>
  )
}
