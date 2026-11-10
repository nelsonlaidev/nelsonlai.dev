import type { ProjectSummary } from './types'

import { buttonVariants } from '@repo/ui/components/button'
import { ExternalLink } from '@repo/ui/components/external-link'
import { cn } from 'cn'
import { ArrowRightIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

type ProjectHeaderProps = Pick<ProjectSummary, 'title' | 'description'> & {
  homepage?: string
  github?: string
}

export function ProjectHeader(props: ProjectHeaderProps) {
  const { title, description, homepage, github } = props

  return (
    <div className='mb-9 flex flex-col items-start justify-between gap-7 md:mb-12 md:flex-row md:items-end md:gap-8'>
      <div className='min-w-0'>
        <h1 className='mb-4 text-7xl tracking-tighter md:mb-5 lg:text-8xl xl:text-9xl'>{title}</h1>
        <p className='text-base/relaxed tracking-tight text-muted-foreground md:text-xl'>{description}</p>
      </div>
      {(homepage ?? github) && (
        <div className='flex max-w-full flex-wrap items-center gap-2 pb-2 md:justify-end'>
          {github && (
            <ExternalLink href={github} className={cn(buttonVariants({ variant: 'outline', size: 'xl' }))}>
              {m.projects_github()}
              <ArrowRightIcon
                className='size-5 motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-visible/button:translate-x-1'
                aria-hidden='true'
              />
            </ExternalLink>
          )}
          {homepage && (
            <ExternalLink href={homepage} className={cn(buttonVariants({ variant: 'ghost', size: 'xl' }))}>
              {m.projects_visit_website()}
              <ArrowRightIcon
                className='size-5 motion-safe:transition-transform motion-safe:group-hover/button:translate-x-1 motion-safe:group-focus-visible/button:translate-x-1'
                aria-hidden='true'
              />
            </ExternalLink>
          )}
        </div>
      )}
    </div>
  )
}
