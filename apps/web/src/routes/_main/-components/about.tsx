import { ExternalLink } from '@repo/ui/components/external-link'
import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { SITE } from '@/lib/site'

type AboutToolboxProps = {
  label: string
  title: React.ReactNode
  groups: Array<{
    label: string
    tools: string[]
  }>
  setupLabel: string
}

export function AboutToolbox(props: AboutToolboxProps) {
  const { label, title, groups, setupLabel } = props

  return (
    <section className='mt-30 grid grid-cols-[1fr_2fr] gap-22.5 max-[1101px]:gap-13.75 max-[1001px]:mt-21.25 max-[1001px]:grid-cols-1 max-[1001px]:gap-6.25'>
      <div>
        <span className='block text-xs/normal text-section-label'>{label}</span>
        <h2 className='mt-6 text-[clamp(38px,4.1vw,64px)] leading-[1.12] font-[410] tracking-tighter max-[601px]:text-[37px] [&_em]:font-serif [&_em]:font-normal [&_em]:tracking-[-0.04em] [&_em]:text-[#bed3c6]'>
          {title}
        </h2>
      </div>
      <div>
        {groups.map((group, index) => (
          <div key={group.label} className='border-t border-t-border px-0 pt-6.25 pb-7.5'>
            <span className='text-sm/normal text-[#84a99a]'>
              0{index + 1} / {group.label}
            </span>
            <p className='mt-4.25 text-[23px] leading-[1.6] tracking-[-0.03em]'>
              {group.tools.map((tool, toolIndex) => (
                <span
                  key={tool}
                  className='font-[inherit] leading-[inherit] [font-weight:inherit] text-inherit [font-style:inherit]'
                >
                  {toolIndex > 0 && (
                    <>
                      {' '}
                      <i className='px-2.25 py-0 text-[#537e6d] not-italic'>·</i>{' '}
                    </>
                  )}
                  {tool}
                </span>
              ))}
            </p>
          </div>
        ))}
        <Link to='/uses' className='inline-flex min-h-11 items-center gap-4 text-sm/normal text-link'>
          {setupLabel}
          <ArrowRightIcon className='size-4.75' aria-hidden='true' />
        </Link>
      </div>
    </section>
  )
}

type AboutStoryProps = {
  label: string
  title: React.ReactNode
  children: React.ReactNode
}

export function AboutStory(props: AboutStoryProps) {
  const { label, title, children } = props

  return (
    <section className='mt-33.75 grid grid-cols-[1fr_2fr] gap-22.5 border-t border-t-border pt-16.25 max-[1101px]:gap-13.75 max-[1001px]:mt-21.25 max-[1001px]:grid-cols-1 max-[1001px]:gap-6.25 max-[601px]:pt-10 [&_a]:text-[#c5dfce] [&_a]:underline [&_a]:underline-offset-4 [&_p]:mt-6 [&_p]:text-base/[1.65] [&_p]:text-[#adc5bb]'>
      <span className='block text-xs/normal text-section-label'>{label}</span>
      <div>
        <h2 className='mb-8 text-[clamp(38px,4.1vw,64px)] leading-[1.12] font-[410] tracking-tighter max-[601px]:text-[37px] [&_em]:font-serif [&_em]:font-normal [&_em]:tracking-[-0.04em] [&_em]:text-[#bed3c6]'>
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}

type AboutSiteProps = {
  label: string
  title: React.ReactNode
  intro: string
  world: string
  projectsLabel: string
  helloLabel: string
}

export function AboutSite(props: AboutSiteProps) {
  const { label, title, intro, world, projectsLabel, helloLabel } = props

  return (
    <section className='mx-auto mt-31.25 mb-11.25 max-w-187.5 text-center max-[601px]:mt-21.25'>
      <span className='block text-xs/normal text-section-label'>{label}</span>
      <h2 className='mt-6 text-[clamp(38px,4.1vw,64px)] leading-[1.12] font-[410] tracking-tighter max-[601px]:text-[34px] [&_em]:font-serif [&_em]:font-normal [&_em]:tracking-[-0.04em] [&_em]:text-[#bed3c6]'>
        {title}
      </h2>
      <p className='mx-auto mt-6.5 mb-0 max-w-152.5 text-base/[1.65] text-[#9fbcaf]'>{intro}</p>
      <p className='mx-auto mt-6.5 mb-0 max-w-152.5 text-base/[1.65] text-[#9fbcaf]'>{world}</p>
      <div className='mt-10 flex flex-wrap items-center justify-center gap-7.5 max-[601px]:gap-6.25'>
        <Link
          to='/projects'
          className='inline-flex min-h-11 items-center justify-center gap-7 rounded-md border border-[#a7cabb65] bg-[#b0d3c30b] px-5.75 py-3.5 text-sm/normal text-[#e0ecde] transition-colors duration-200 ease-linear hover:border-[#c4e0cc] hover:bg-[#b0d3c31c] motion-reduce:transition-none'
        >
          {projectsLabel}
          <ArrowRightIcon className='size-4.75' aria-hidden='true' />
        </Link>
        <Link to='/guestbook' className='inline-flex min-h-11 items-center gap-4 text-sm/normal text-link'>
          {helloLabel}
          <ArrowRightIcon className='size-4.75' aria-hidden='true' />
        </Link>
      </div>
    </section>
  )
}

type AboutHeroProps = {
  title: string
  intro: string
  githubLabel: string
  caption: string
}

export function AboutHero(props: AboutHeroProps) {
  const { title, intro, githubLabel, caption } = props

  return (
    <div className='grid grid-cols-[1.5fr_1fr] items-center gap-16.25 max-[1101px]:gap-7.5 max-[1001px]:grid-cols-1'>
      <div className='mb-0'>
        <h1 className='text-[clamp(48px,5.8vw,86px)] leading-[1.04] font-[420] tracking-[-0.065em]'>{title}</h1>
        <p className='mt-7 max-w-150 text-lg/[1.65] whitespace-pre-line text-[#b1cbc4]'>{intro}</p>
        <ExternalLink
          href={SITE.socials.github}
          className='mt-7 inline-flex min-h-11 items-center gap-2 text-sm/normal text-link'
        >
          {githubLabel}
          <ArrowRightIcon className='size-4.75' aria-hidden='true' />
        </ExternalLink>
      </div>
      <div aria-hidden='true' className='max-[1001px]:mt-17.5'>
        <div className='relative mx-auto my-0 aspect-square w-60 rounded-full border border-[#7db7b32b] shadow-[inset_0_0_60px_#2e6f741a,0_0_90px_#31636910] [background:radial-gradient(circle_at_45%_35%,#3a7b8133,#062033_65%)] before:absolute before:-inset-6.25 before:rounded-full before:border before:border-[#78a7a614] before:content-[""] after:absolute after:-inset-11.25 after:rounded-full after:border after:border-dashed after:border-[#78a7a614] after:content-[""] max-[1101px]:w-47.5'>
          <div className='absolute inset-[9%] overflow-hidden rounded-full [background:radial-gradient(ellipse_at_40%_0%,#8ab6a41a,transparent_65%)] after:absolute after:top-[45%] after:left-[15%] after:h-[20%] after:w-[70%] after:transform-[rotate(-15deg)] after:rounded-[50%_10%_50%_40%] after:bg-[#99c2b527] after:content-[""] after:[clip-path:polygon(0_45%,12%_0,19%_30%,45%_10%,80%_20%,100%_45%,78%_70%,42%_68%,29%_100%,29%_64%,15%_60%,5%_100%)]' />
          <span className='absolute top-[9%] left-[25%] size-1 rounded-full bg-[#c4e8d3] shadow-[0_0_15px_#c4e8d3]' />
        </div>
        <span className='mt-15 block text-center font-serif text-sm leading-[normal] font-normal text-[#769c9c] italic'>
          {caption}
        </span>
      </div>
    </div>
  )
}
