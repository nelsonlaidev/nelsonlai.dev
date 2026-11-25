import { buttonVariants } from '@repo/ui/components/button'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { ArrowRightIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

import { Section } from './section'

export function Cta() {
  return (
    <Section id='site' className='space-y-8 py-24 text-center md:py-36'>
      <h2
        id='site-title'
        className='font-serif text-4xl tracking-tight text-balance text-primary italic lg:text-5xl 2xl:text-6xl'
      >
        {m.home_site_title()}
      </h2>
      <p className='mx-auto max-w-lg px-3 leading-relaxed text-balance text-muted-foreground'>{m.home_site_intro()}</p>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        <Link to='/guestbook' className={cn(buttonVariants({ size: 'lg' }))}>
          {m.home_site_guestbook()}
        </Link>
        <Link to='/projects' className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }))}>
          {m.home_site_projects()}
          <ArrowRightIcon
            className='size-5 motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-visible/button:translate-x-1'
            aria-hidden='true'
            data-icon='inline-end'
          />
        </Link>
      </div>
    </Section>
  )
}
