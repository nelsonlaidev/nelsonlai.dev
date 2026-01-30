import { BellOffIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function UnsubscribeError() {
  const t = useTranslations()

  return (
    <Card className='w-full max-w-lg'>
      <CardHeader className='space-y-4 text-center'>
        <div className='mx-auto flex size-16 items-center justify-center rounded-full bg-accent'>
          <BellOffIcon className='size-8' />
        </div>
        <div className='space-y-4'>
          <CardTitle className='text-2xl text-balance'>{t('unsubscribe.invalid-unsubscribe-link')}</CardTitle>
          <CardDescription className='text-base text-pretty text-muted-foreground'>
            {t('unsubscribe.invalid-link-description')}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  )
}

export default UnsubscribeError
