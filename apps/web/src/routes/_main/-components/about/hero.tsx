import { ExternalLink } from '@repo/ui/components/external-link'
import { ArrowRightIcon } from 'lucide-react'

import { PageHeader } from '@/components/page-header'
import { SITE } from '@/lib/site'

import { FishIllustration } from '../fish-illustration'

type AboutHeroProps = {
  title: string
  intro: string
  githubLabel: string
  caption: string
}

export function AboutHero(props: AboutHeroProps) {
  const { title, intro, githubLabel, caption } = props

  return (
    <div className='mb-20 grid grid-cols-1 items-center gap-8 lg:mb-32 lg:grid-cols-[1.5fr_1fr] xl:gap-16'>
      <PageHeader title={title} description={intro} className='mb-0 sm:mb-0'>
        <ExternalLink
          href={SITE.socials.github}
          className='group mt-7 inline-flex items-center gap-2 text-sm text-link'
        >
          {githubLabel}
          <ArrowRightIcon
            className='size-5 transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1 motion-reduce:transition-none'
            aria-hidden='true'
          />
        </ExternalLink>
      </PageHeader>
      <div aria-hidden='true' className='mt-16 lg:mt-0'>
        <FishIllustration />
        <span className='mt-16 block text-center font-serif text-sm text-muted-foreground italic'>{caption}</span>
      </div>
    </div>
  )
}
