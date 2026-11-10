import { ArrowDownIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

import { Section } from './section'

export function Hero() {
  return (
    <Section
      id='home'
      className='relative flex min-h-svh flex-col justify-center pt-48 pb-28 md:pt-[max(180px,26vh)] md:pb-24'
    >
      <p className='mb-7 flex items-center gap-3 text-xs text-primary md:mb-8'>
        <span className='h-px w-6 bg-current' aria-hidden='true' />
        {m.home_hero_kicker()}
      </p>
      <h1
        id='home-title'
        className='mb-7 max-w-6xl text-5xl tracking-tighter sm:text-6xl md:mb-9 lg:text-7xl xl:text-8xl'
      >
        {m.home_hero_title()}
        <br />
        {m.home_hero_below()} <em className='font-serif text-primary'>{m.home_hero_emphasis()}</em>
      </h1>
      <div className='max-w-4xl items-end justify-between gap-10 md:flex'>
        <p className='text-base/relaxed whitespace-pre-line text-muted-foreground max-md:mb-9'>
          {m.home_hero_description()}
        </p>
        <a href='#projects' className='group flex w-fit items-center gap-5 text-sm'>
          {m.home_hero_dive()}
          <span className='grid size-10 place-items-center rounded-full border motion-safe:transition-transform motion-safe:group-hover:translate-y-1 motion-safe:group-focus-visible:translate-y-1 md:size-12'>
            <ArrowDownIcon className='size-5' aria-hidden='true' />
          </span>
        </a>
      </div>
      <div className='absolute right-8 bottom-8 left-[8%] flex max-w-3xs flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground md:left-[10%] md:max-w-none md:gap-x-5'>
        <span>{m.home_hero_coordinate()}</span>
        <span className='h-px w-6 bg-current md:w-10' aria-hidden='true' />
        <span>{m.home_hero_possibilities()}</span>
      </div>
    </Section>
  )
}
