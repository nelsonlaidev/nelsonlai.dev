'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { range } from '@/utils/range'

function ActiveSessionsSkeleton() {
  return (
    <div className='space-y-4'>
      {range(5).map((sessionNumber) => (
        <Card key={sessionNumber} className='p-4 sm:p-6'>
          <div className='flex gap-4'>
            <Skeleton className='size-12 rounded-full' />
            <div className='space-y-1'>
              <div className='flex h-12 items-center gap-4 font-semibold'>
                <Skeleton className='h-6 w-40' />
              </div>
              <div className='space-y-2 text-sm'>
                {range(3).map((infoNumber) => (
                  <Skeleton key={infoNumber} className='h-4 w-32' />
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default ActiveSessionsSkeleton
