'use client'

import type { User } from '@repo/db'

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar'
import { Button } from '@repo/ui/components/button'
import { Card } from '@repo/ui/components/card'
import { getAbbreviation } from '@repo/utils'
import { useTranslations } from 'next-intl'

import { useSession } from '@/hooks/queries/auth.query'
import { useFormattedDate } from '@/hooks/use-formatted-date'

import ProfileSkeleton from './profile-skeleton'

const Profile = () => {
  const { isSuccess, isLoading, isError, data } = useSession()
  const t = useTranslations()

  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-semibold'>{t('account.profile')}</h2>
      <Card className='p-4 sm:p-6'>
        {isLoading && <ProfileSkeleton />}
        {isError && <div>{t('error.something-went-wrong')}</div>}
        {isSuccess && data && <ProfileInfo user={data.user} />}
      </Card>
    </div>
  )
}

type ProfileInfoProps = {
  user: User
}

const ProfileInfo = (props: ProfileInfoProps) => {
  const { user } = props
  const createdAt = useFormattedDate(user.createdAt)
  const t = useTranslations()

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.avatar')}</span>
          <Avatar className='size-24'>
            <AvatarImage src={user.image ?? undefined} className='size-full' />
            <AvatarFallback>{getAbbreviation(user.name)}</AvatarFallback>
          </Avatar>
        </div>
        <Button variant='outline'>{t('account.update-avatar')}</Button>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.display-name')}</span>
          <span>{user.name}</span>
        </div>
        <Button variant='outline'>{t('account.edit-name')}</Button>
      </div>
      <div>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.email')}</span>
          <span>{user.email}</span>
        </div>
      </div>
      <div>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground'>{t('account.account-created')}</span>
          <span>{createdAt}</span>
        </div>
      </div>
    </>
  )
}

export default Profile
