import { MessageCircleIcon, PinIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

function Pinned() {
  const t = useTranslations()

  return (
    <div className='relative overflow-hidden rounded-2xl border text-card-foreground'>
      {/* Gradient Background */}
      <div className='absolute inset-0 bg-linear-to-br from-blue-50 via-purple-50 to-rose-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-rose-900/10' />

      {/* Pin Icon */}
      <div className='absolute top-4 right-4'>
        <PinIcon className='size-5 rotate-45 text-muted-foreground' />
      </div>

      <div className='relative p-6'>
        <div className='flex items-start gap-4'>
          <div className='hidden size-10 shrink-0 items-center justify-center rounded-full bg-muted sm:flex'>
            <MessageCircleIcon className='size-5 text-primary' />
          </div>
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>{t('guestbook.pinned.greeting')}</h2>
            <p className='text-sm text-muted-foreground'>{t('guestbook.pinned.description')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pinned
