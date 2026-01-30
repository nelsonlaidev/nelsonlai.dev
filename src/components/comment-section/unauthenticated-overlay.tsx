import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { useSignInDialog } from '@/hooks/use-sign-in-dialog'

function UnauthenticatedOverlay() {
  const t = useTranslations()
  const { openDialog } = useSignInDialog()

  return (
    <div className='absolute inset-0 flex items-center justify-center rounded-md bg-black/5 backdrop-blur-[0.8px]'>
      <Button size='sm' onClick={openDialog}>
        {t('common.sign-in')}
      </Button>
    </div>
  )
}

export default UnauthenticatedOverlay
