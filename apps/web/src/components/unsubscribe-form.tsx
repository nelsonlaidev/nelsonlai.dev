'use client'

import type { getReplyUnsubData } from '@/lib/unsubscribe'

import { Button } from '@repo/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import { BellOffIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { useUpdateCommentReplyPrefs } from '@/hooks/queries/unsubscribe.query'

type UnsubscribeFormProps = {
  data: NonNullable<Awaited<ReturnType<typeof getReplyUnsubData>>>
}

const UnsubscribeForm = (props: UnsubscribeFormProps) => {
  const { data } = props
  const [isUnsubscribed, setIsUnsubscribed] = useState(data.isUnsubscribed)
  const { mutate: updatePrefs, isPending: isUpdating } = useUpdateCommentReplyPrefs(() => {
    setIsUnsubscribed(true)
  })
  const t = useTranslations()

  const handleUnsubscribe = () => {
    if (isUpdating) return
    updatePrefs({ token: data.token })
  }

  return (
    <Card className='w-full max-w-lg'>
      <CardHeader className='space-y-4 text-center'>
        <div className='mx-auto flex size-16 items-center justify-center rounded-full bg-accent'>
          <BellOffIcon className='size-8' />
        </div>
        <div className='space-y-2'>
          <CardTitle className='text-2xl text-balance'>
            {isUnsubscribed
              ? t('unsubscribe.you-have-been-unsubscribed')
              : t('unsubscribe.unsubscribe-from-this-comment')}
          </CardTitle>
          <CardDescription className='text-base text-pretty text-muted-foreground'>
            {isUnsubscribed
              ? t('unsubscribe.unsubscribed-description')
              : t('unsubscribe.stop-receiving-email-notifications')}
          </CardDescription>
        </div>
      </CardHeader>
      {!isUnsubscribed && (
        <CardContent className='space-y-8'>
          <div className='space-y-2'>
            <p>{t('common.labels.comment')}</p>
            <div className='rounded-lg border p-3 dark:bg-input/30'>
              <p className='text-sm text-pretty text-muted-foreground'>{data.comment}</p>
            </div>
          </div>

          <div className='space-y-3'>
            <Button onClick={handleUnsubscribe} disabled={isUpdating} className='w-full'>
              {t('common.labels.unsubscribe')}
            </Button>

            <div className='space-y-1 text-center text-xs text-balance text-muted-foreground'>
              <p>{t('unsubscribe.you-are-unsubscribing-as', { email: data.userEmail })}</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

export default UnsubscribeForm
