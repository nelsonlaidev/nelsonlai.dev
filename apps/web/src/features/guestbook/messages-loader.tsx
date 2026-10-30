import { Skeleton } from '@repo/ui/components/skeleton'
import { createRange } from '@repo/utils'
import { cn } from 'cn'

function Placeholder() {
  return (
    <div className='rounded-xl border p-4'>
      <div className='mb-3 flex gap-3'>
        <Skeleton className='size-10 shrink-0 rounded-full bg-[#b0d3c31a] motion-reduce:animate-none' />
        <div className='flex min-w-0 flex-1 flex-col justify-center gap-2'>
          <Skeleton className='h-4 w-full max-w-40 bg-[#b0d3c31a] motion-reduce:animate-none' />
          <Skeleton className='h-3 w-full max-w-36 bg-[#b0d3c31a] motion-reduce:animate-none' />
        </div>
      </div>
      <div className='pl-13'>
        <Skeleton className='h-6 w-full max-w-xs bg-[#b0d3c31a] motion-reduce:animate-none' />
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
