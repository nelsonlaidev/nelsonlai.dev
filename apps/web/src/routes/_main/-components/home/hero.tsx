import { m } from '@/paraglide/messages'

export function Hero() {
  return (
    <div className='my-16 flex items-start justify-between gap-8'>
      <div className='min-w-0 flex-1 space-y-4'>
        <h1 className='max-w-md text-3xl/relaxed font-semibold text-balance'>{m.hero_intro()}</h1>
        <p className='text-sm text-muted-foreground'>{m.hero_location()}</p>
      </div>
      <div aria-hidden='true' className='relative hidden size-28 shrink-0 md:block'>
        <img src='/images/avatar.png' className='size-28 rounded-full' width={1024} height={1024} alt='' />
        <div className='absolute inset-0 -z-10 bg-linear-to-tl from-purple-700 to-orange-700 opacity-50 blur-2xl' />
      </div>
    </div>
  )
}
