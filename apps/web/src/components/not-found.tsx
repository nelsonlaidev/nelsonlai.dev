import { buttonVariants } from '@repo/ui/components/button'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { ArrowRightIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

export function NotFound() {
  return (
    <div className='relative mx-auto flex min-h-[85vh] w-full flex-col items-center justify-center gap-8 overflow-hidden px-4 pt-48 pb-20 text-center sm:px-[max(16px,10%)] sm:pt-56 sm:pb-24'>
      <span
        aria-hidden='true'
        className='pointer-events-none absolute top-1/2 left-1/2 block -translate-1/2 text-[clamp(230px,40vw,480px)] tracking-tight text-[#9ac6b40f]'
      >
        404
      </span>
      <h1 className='relative text-5xl tracking-tight text-foreground lg:text-6xl xl:text-7xl'>
        {m.not_found_title()}
        <br />
        <em className='font-serif text-primary'>{m.not_found_emphasis()}</em>
      </h1>
      <p className='relative mx-auto max-w-md leading-relaxed text-muted-foreground'>{m.not_found_description()}</p>
      <Link to='/' className={cn(buttonVariants({ variant: 'outline', size: 'xl' }))}>
        {m.common_go_to_homepage()}
        <ArrowRightIcon
          aria-hidden='true'
          className='size-4 motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-visible/button:translate-x-1'
        />
      </Link>
    </div>
  )
}
