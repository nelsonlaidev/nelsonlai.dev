import { MessageCircleIcon, PinIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

export function Pinned() {
  return (
    <div className='relative overflow-hidden rounded-2xl border text-card-foreground'>
      <div className='absolute inset-0 bg-linear-to-br from-blue-50 via-purple-50 to-rose-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-rose-900/10' />

      <div className='absolute top-4 right-4'>
        <PinIcon className='size-5 rotate-45 text-muted-foreground' aria-hidden='true' />
      </div>

      <div className='relative p-4'>
        <div className='flex items-start gap-4'>
          <div className='hidden size-10 shrink-0 items-center justify-center rounded-full bg-muted sm:flex'>
            <MessageCircleIcon className='size-5 text-primary' aria-hidden='true' />
          </div>
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>{m.guestbook_pinned_greeting()}</h2>
            <p className='text-sm text-muted-foreground'>{m.guestbook_pinned_description()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
