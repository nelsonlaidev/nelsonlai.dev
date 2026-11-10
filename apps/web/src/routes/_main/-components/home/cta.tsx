import { buttonVariants } from '@repo/ui/components/button'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { ArrowRightIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

import { Section } from './section'

export function Cta() {
  return (
    <Section id='site' className='pt-20 pb-11 text-center sm:pt-32'>
      <span className='mb-6 block text-xs/normal text-section-label'>{m.home_site_label()}</span>
      <h2 id='site-title' className='mb-7 text-4xl tracking-tighter lg:text-5xl 2xl:text-6xl'>
        {m.home_site_title()}
        <br />
        <em className='font-serif text-primary'>{m.home_site_emphasis()}</em>
      </h2>
      <p className='mx-auto mb-7 max-w-xl text-base/relaxed text-muted-foreground'>{m.home_site_intro()}</p>
      <p className='mx-auto mb-10 max-w-xl text-base/relaxed text-muted-foreground'>{m.home_site_world()}</p>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        <Link to='/projects' className={cn(buttonVariants({ variant: 'outline', size: 'xl' }))}>
          {m.home_site_projects()}
          <ArrowRightIcon
            className='size-5 motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-visible/button:translate-x-1'
            aria-hidden='true'
          />
        </Link>
        <Link to='/guestbook' className={cn(buttonVariants({ variant: 'ghost', size: 'xl' }))}>
          {m.home_site_hello()}
          <ArrowRightIcon
            className='size-5 motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-visible/button:translate-x-1'
            aria-hidden='true'
          />
        </Link>
      </div>
    </Section>
  )
}
