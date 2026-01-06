import { Skeleton } from '@repo/ui/components/skeleton'

function SkeletonDemo() {
  return (
    <div className='flex items-center space-x-4'>
      <Skeleton className='size-12 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-62.5' />
        <Skeleton className='h-4 w-50' />
      </div>
    </div>
  )
}

export default SkeletonDemo
