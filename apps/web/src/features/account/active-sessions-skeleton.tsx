import { Card, CardContent } from '@repo/ui/components/card'
import { Skeleton } from '@repo/ui/components/skeleton'
import { createRange } from '@repo/utils'

export function ActiveSessionsSkeleton() {
  return (
    <div className='space-y-4'>
      {createRange(5).map((sessionNumber) => (
        <Card key={sessionNumber}>
          <CardContent className='flex gap-4'>
            <Skeleton className='size-12 rounded-full' />
            <div className='space-y-1'>
              <div className='flex h-12 items-center gap-4 font-semibold'>
                <Skeleton className='h-6 w-40' />
              </div>
              <div className='space-y-2 text-sm'>
                {createRange(3).map((infoNumber) => (
                  <Skeleton key={infoNumber} className='h-4 w-32' />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
