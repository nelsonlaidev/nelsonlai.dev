import { Button } from '@repo/ui/components/button'
import { Skeleton } from '@repo/ui/components/skeleton'

const ProfileSkeleton = () => {
  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>Avatar</span>
          <Skeleton className='size-24 rounded-full' />
        </div>
        <Button variant='outline'>Update Avatar</Button>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>Display Name</span>
          <Skeleton className='h-6 w-20' />
        </div>
        <Button variant='outline'>Edit Name</Button>
      </div>
      <div>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>Email</span>
          <Skeleton className='h-6 w-20' />
        </div>
      </div>
      <div>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>Account created</span>
          <Skeleton className='h-6 w-20' />
        </div>
      </div>
    </>
  )
}

export default ProfileSkeleton
