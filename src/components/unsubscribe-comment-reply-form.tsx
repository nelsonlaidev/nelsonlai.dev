'use client'

import type { getUnsubData } from '@/lib/unsubscribe'

import { BellOffIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateCommentReplyUnsubscribe } from '@/hooks/queries/unsubscribe.query'

import { Spinner } from './ui/spinner'

type UnsubscribeCommentReplyFormProps = {
  data: NonNullable<Awaited<ReturnType<typeof getUnsubData>>> & { type: 'comment_reply' }
}

function UnsubscribeCommentReplyForm(props: UnsubscribeCommentReplyFormProps) {
  const { data } = props
  const [isUnsubscribed, setIsUnsubscribed] = useState(data.isUnsubscribed)
  const { mutate: createCommentReplyUnsubscribe, isPending: isUpdating } = useCreateCommentReplyUnsubscribe(() => {
    setIsUnsubscribed(true)
  })
  const t = useTranslations()

  function handleUnsubscribe() {
    if (isUpdating) return
    createCommentReplyUnsubscribe({ token: data.token })
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
            <div className='rounded-xl border p-3 dark:bg-input/30'>
              <p className='text-sm text-pretty text-muted-foreground'>{data.comment}</p>
            </div>
          </div>

          <div className='space-y-3'>
            <Button onClick={handleUnsubscribe} disabled={isUpdating} className='w-full'>
              {isUpdating && <Spinner data-icon='inline-start' />}
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

export default UnsubscribeCommentReplyForm
