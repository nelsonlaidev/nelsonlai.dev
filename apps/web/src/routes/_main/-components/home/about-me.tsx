import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

import { SectionHeading } from './section-heading'

export function AboutMe() {
  return (
    <section
      id='about'
      aria-labelledby='about-title'
      className='mx-auto w-full max-w-400 scroll-mt-12.5 py-25 pr-[max(16px,env(safe-area-inset-right))] pl-[max(16px,env(safe-area-inset-left))] min-[701px]:min-h-svh min-[701px]:scroll-mt-17.5 min-[701px]:px-[10%] min-[701px]:py-37.5'
    >
      <div className='grid items-center gap-17.5 min-[701px]:grid-cols-2 min-[701px]:gap-25'>
        <div className='order-2 text-center min-[701px]:order-0' aria-hidden='true'>
          <div className='relative mx-auto my-0 aspect-square w-[min(330px,100%)] rounded-full border border-[#7db7b32b] shadow-[inset_0_0_60px_#2e6f741a,0_0_90px_#31636910] [background:radial-gradient(circle_at_45%_35%,#3a7b8133,#062033_65%)] before:absolute before:-inset-6.25 before:rounded-full before:border before:border-[#78a7a614] before:content-[""] after:absolute after:-inset-11.25 after:rounded-full after:border after:border-dashed after:border-[#78a7a614] after:content-[""] max-[701px]:w-55'>
            <div className='absolute inset-[9%] overflow-hidden rounded-full [background:radial-gradient(ellipse_at_40%_0%,#8ab6a41a,transparent_65%)] after:absolute after:top-[45%] after:left-[15%] after:h-[20%] after:w-[70%] after:transform-[rotate(-15deg)] after:rounded-[50%_10%_50%_40%] after:bg-[#99c2b527] after:content-[""] after:[clip-path:polygon(0_45%,12%_0,19%_30%,45%_10%,80%_20%,100%_45%,78%_70%,42%_68%,29%_100%,29%_64%,15%_60%,5%_100%)]' />
            <span className='absolute top-[9%] left-[25%] size-1 rounded-full bg-[#c4e8d3] shadow-[0_0_15px_#c4e8d3]' />
          </div>
          <span className='mt-17.5 block font-serif text-sm text-[#769c9c] italic'>{m.home_about_curiosity()}</span>
        </div>
        <div>
          <SectionHeading
            compact
            id='about-title'
            eyebrow={`03 / ${m.nav_about()}`}
            title={m.home_about_title()}
            emphasis={m.home_about_emphasis()}
          />
          <p className='max-w-107.5 text-base/[1.65] text-muted-foreground'>{m.home_about_intro()}</p>
          <p className='mt-5 max-w-107.5 text-base/[1.65] text-muted-foreground'>{m.home_about_story()}</p>
          <p className='mt-7.5 max-w-107.5 text-base/[1.65] whitespace-pre-line text-[#c0d0c5]'>
            {m.home_about_aside()}
          </p>
          <Link to='/about' className='mt-8 inline-flex min-h-11 items-center gap-3 text-sm text-primary'>
            {m.home_about_more()}
            <ArrowRightIcon className='size-5' aria-hidden='true' />
          </Link>
        </div>
      </div>
    </section>
  )
}
