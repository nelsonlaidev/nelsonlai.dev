'use client'

import { Card } from '@repo/ui/components/card'
import { Label } from '@repo/ui/components/label'
import { Skeleton } from '@repo/ui/components/skeleton'
import { Switch } from '@repo/ui/components/switch'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { useReplyPrefs, useUpdateReplyPrefs } from '@/hooks/queries/unsubscribe.query'

const Settings = () => {
  const t = useTranslations()

  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-semibold'>{t('settings.notification-settings')}</h2>
      <Card className='p-4 sm:p-6'>
        <ReplyNotificationSettings />
      </Card>
    </div>
  )
}

const ReplyNotificationSettings = () => {
  const { isSuccess, isLoading, isError, data } = useReplyPrefs()
  const t = useTranslations()
  const { mutate: updatePrefs, isPending: isUpdating } = useUpdateReplyPrefs(() => {
    toast.success(t('success.settings-saved'))
  })

  const handleUpdatePrefs = (isEnabled: boolean) => {
    if (isUpdating) return
    updatePrefs({ isEnabled })
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='space-y-0.5'>
        <Label className='text-base'>{t('settings.reply-notification')}</Label>
        <p className='text-muted-foreground'>{t('settings.reply-notification-description')}</p>
      </div>
      {isLoading && <Skeleton className='h-6 w-10' />}
      {isError && <p className='text-sm'>{t('error.failed-to-load')}</p>}
      {isSuccess && <Switch checked={data.isEnabled} onCheckedChange={handleUpdatePrefs} disabled={isUpdating} />}
    </div>
  )
}

export default Settings
