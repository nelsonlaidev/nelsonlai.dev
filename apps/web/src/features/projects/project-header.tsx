import type { ProjectSummary } from './types'

import { buttonVariants } from '@repo/ui/components/button'
import { ExternalLink } from '@repo/ui/components/external-link'
import { cn } from 'cn'
import { ArrowRightIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

import { projectSpecimen } from './presentation'

type ProjectHeaderProps = Pick<ProjectSummary, 'slug' | 'title' | 'description'> & {
  homepage?: string
  github?: string
  category: string
}

export function ProjectHeader(props: ProjectHeaderProps) {
  const { slug, title, description, homepage, github, category } = props

  return (
    <div className='mb-8.75 flex flex-col items-start justify-between gap-6.75 min-[701px]:mb-12.5 min-[701px]:flex-row min-[701px]:items-end min-[701px]:gap-7.5'>
      <div className='min-w-0'>
        <span className='mb-6 block text-xs/normal tracking-[0.02em] text-[#b9d4c7]'>
          {m.project_category()} {String(projectSpecimen(slug).number).padStart(2, '0')} / {category}
        </span>
        <h1 className='text-[clamp(68px,9vw,130px)] leading-[1.04] font-[420] tracking-[-0.065em] max-[701px]:text-[70px]'>
          {title}
        </h1>
        <p className='mt-3.75 text-[17px]/[1.6] tracking-tight text-[#b1ccc3] min-[701px]:mt-5 min-[701px]:text-xl'>
          {description}
        </p>
      </div>
      {(homepage ?? github) && (
        <div className='flex shrink-0 flex-col items-start gap-5 pb-2 min-[701px]:items-end'>
          {github && (
            <ExternalLink href={github} className={cn(buttonVariants({ variant: 'outline', size: 'xl' }))}>
              {m.projects_github()}
              <ArrowRightIcon className='size-5' aria-hidden='true' />
            </ExternalLink>
          )}
          {homepage && (
            <ExternalLink href={homepage} className='inline-flex min-h-11 items-center gap-4 text-sm text-link'>
              {m.projects_visit_website()}
              <ArrowRightIcon className='size-5' aria-hidden='true' />
            </ExternalLink>
          )}
        </div>
      )}
    </div>
  )
}
