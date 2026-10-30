import { ArrowDownIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

export function Hero() {
  return (
    <section
      id='surface'
      aria-labelledby='surface-title'
      className='relative mx-auto flex min-h-svh w-full max-w-400 flex-col justify-center pt-47.5 pr-[max(16px,env(safe-area-inset-right))] pb-27.5 pl-[max(16px,env(safe-area-inset-left))] min-[701px]:px-[10%] min-[701px]:pt-[max(180px,26vh)] min-[701px]:pb-25'
    >
      <p className='mb-6.5 flex items-center gap-3 text-xs text-primary min-[701px]:mb-7.5'>
        <span className='h-px w-6 bg-current' aria-hidden='true' />
        {m.ocean_kicker()}
      </p>
      <h1
        id='surface-title'
        className='max-w-6xl text-[clamp(48px,9.5vw,68px)] leading-[1.04] font-[420] tracking-[-0.065em] min-[701px]:text-[clamp(56px,7.1vw,110px)]'
      >
        {m.ocean_hero_title()}
        <br />
        {m.ocean_hero_below()} <em className='font-serif text-primary'>{m.ocean_hero_emphasis()}</em>
      </h1>
      <div className='mt-7 max-w-235 items-end justify-between gap-10 min-[701px]:mt-9.25 min-[701px]:flex'>
        <p className='text-base/[1.65] whitespace-pre-line text-muted-foreground'>{m.ocean_hero_description()}</p>
        <a href='#discoveries' className='mt-9 flex min-h-11 w-fit items-center gap-5 text-sm min-[701px]:mt-0'>
          {m.ocean_dive()}
          <span className='grid size-10 place-items-center rounded-full border border-primary/60 transition-transform hover:translate-y-1 motion-reduce:transition-none min-[701px]:size-12'>
            <ArrowDownIcon className='size-5' aria-hidden='true' />
          </span>
        </a>
      </div>
      <div className='absolute right-8 bottom-8 left-[8%] flex max-w-67.5 flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground min-[701px]:left-[10%] min-[701px]:max-w-none min-[701px]:gap-x-4.5'>
        <span>{m.ocean_coordinate()}</span>
        <span className='h-px w-6.25 bg-current min-[701px]:w-10' aria-hidden='true' />
        <span>{m.ocean_possibilities()}</span>
      </div>
    </section>
  )
}
