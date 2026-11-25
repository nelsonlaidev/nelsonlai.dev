import { ArrowDownIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

import { Section } from './section'

export function Hero() {
  return (
    <Section id='home' className='flex min-h-svh flex-col justify-center pt-48 pb-28 md:pt-[max(180px,26vh)] md:pb-24'>
      <h1
        id='home-title'
        className='mb-7 max-w-6xl text-5xl tracking-tight sm:text-6xl md:mb-9 lg:text-7xl xl:text-8xl'
      >
        {m.home_hero_title()}
        <br />
        {m.home_hero_below()} <em className='font-serif text-primary'>{m.home_hero_emphasis()}</em>
      </h1>
      <div className='max-w-4xl items-end justify-between gap-10 md:flex'>
        <p className='leading-relaxed whitespace-pre-line text-muted-foreground max-md:mb-9'>
          {m.home_hero_description()}
        </p>
        <a href='#projects' className='group flex w-fit items-center gap-5 text-sm'>
          {m.home_hero_dive()}
          <span className='grid size-10 place-items-center rounded-full border motion-safe:transition-transform motion-safe:group-hover:translate-y-1 motion-safe:group-focus-visible:translate-y-1 md:size-12'>
            <ArrowDownIcon className='size-5' aria-hidden='true' />
          </span>
        </a>
      </div>
    </Section>
  )
}
