import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

function ProfileSkeleton() {
  const t = useTranslations()

  return (
    <Card className='p-4 sm:p-6'>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.avatar')}</span>
          <Skeleton className='size-24 rounded-full' />
        </div>
        <Button variant='outline'>{t('account.update-avatar')}</Button>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.display-name')}</span>
          <Skeleton className='h-6 w-20' />
        </div>
        <Button variant='outline'>{t('account.edit-name')}</Button>
      </div>
      <div>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.email')}</span>
          <Skeleton className='h-6 w-20' />
        </div>
      </div>
      <div>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.account-created')}</span>
          <Skeleton className='h-6 w-20' />
        </div>
      </div>
    </Card>
  )
}

export default ProfileSkeleton
