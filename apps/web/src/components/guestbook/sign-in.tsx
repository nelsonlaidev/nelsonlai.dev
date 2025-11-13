'use client'

import { Button } from '@repo/ui/components/button'
import { useTranslations } from 'next-intl'

import { useSignInDialog } from '@/hooks/use-sign-in-dialog'

const SignIn = () => {
  const t = useTranslations()
  const { openDialog } = useSignInDialog()

  return (
    <>
      <Button
        className='inline-block bg-linear-to-br from-[#fcd34d] via-[#ef4444] to-[#ec4899] font-extrabold dark:text-foreground'
        onClick={openDialog}
      >
        {t('common.sign-in')}
      </Button>
      <span className='ml-2'>{t('guestbook.signin.description')}</span>
    </>
  )
}

export default SignIn
