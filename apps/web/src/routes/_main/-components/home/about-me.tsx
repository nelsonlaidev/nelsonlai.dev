import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

import { FishIllustration } from '../fish-illustration'
import { Section } from './section'

export function AboutMe() {
  return (
    <Section id='about' className='grid items-center gap-16 py-24 md:grid-cols-2 md:gap-24 md:py-36'>
      <div className='md:order-1'>
        <h2 id='about-title' className='mb-4 text-4xl tracking-tighter lg:text-5xl'>
          {m.home_about_title()}
        </h2>
        <p className='mb-6 max-w-prose text-base/relaxed text-muted-foreground'>{m.home_about_intro()}</p>
        <Link to='/about' className='group inline-flex items-center gap-2 text-sm text-primary'>
          {m.home_about_more()}
          <ArrowRightIcon
            className='size-5 motion-safe:transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1'
            aria-hidden='true'
          />
        </Link>
      </div>
      <FishIllustration />
    </Section>
  )
}
