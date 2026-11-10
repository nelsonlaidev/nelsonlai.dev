import { buttonVariants } from '@repo/ui/components/button'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { ArrowUpRightIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

export function NotFound() {
  return (
    <div className='mt-52 mb-40 flex flex-col items-center justify-center gap-12'>
      <h1 className='text-center text-6xl font-semibold'>{m.error_not_found()}</h1>
      <Link to='/' className={cn(buttonVariants())}>
        {m.common_go_to_homepage()}
      </Link>
    </div>
  )
}

export function PublicNotFound() {
  return (
    <div className='relative mx-auto min-h-[85vh] w-full overflow-hidden px-4 pt-48 pb-20 text-center wrap-anywhere subpixel-antialiased sm:px-[max(16px,10%)] sm:pt-56 sm:pb-24'>
      <span className='text-xs/normal text-section-label'>{m.not_found_eyebrow()}</span>
      <span
        aria-hidden='true'
        className='pointer-events-none absolute top-[43%] left-1/2 block -translate-1/2 font-serif text-[clamp(230px,40vw,480px)] leading-normal -tracking-widest text-[#9ac6b407]'
      >
        404
      </span>
      <h1 className='relative text-5xl tracking-tighter text-foreground lg:text-6xl xl:text-7xl'>
        {m.not_found_title()}
        <br />
        <em className='font-serif text-primary'>{m.not_found_emphasis()}</em>
      </h1>
      <p className='relative mx-auto mt-8 max-w-md text-base/relaxed text-muted-foreground'>
        {m.not_found_description()}
      </p>
      <div className='relative mt-10 flex flex-wrap items-center justify-center gap-8'>
        <Link to='/' className={cn(buttonVariants({ variant: 'outline', size: 'xl' }))}>
          {m.common_go_to_homepage()}
          <ArrowUpRightIcon aria-hidden='true' className='size-4' />
        </Link>
        <Link to='/projects' className='inline-flex items-center gap-4 text-sm/normal text-link'>
          {m.nav_projects()}
          <ArrowUpRightIcon aria-hidden='true' className='size-4' />
        </Link>
      </div>
    </div>
  )
}
