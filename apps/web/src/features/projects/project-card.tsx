import type { ProjectSummary } from './types'

import { Link } from '@tanstack/react-router'
import { cn } from 'cn'

import { ProjectArt } from './project-art'

type ProjectCardProps = {
  project: ProjectSummary
  featured?: boolean
  className?: string
}

export function ProjectCard(props: ProjectCardProps) {
  const { project, featured = false, className } = props
  const Heading = featured ? 'h3' : 'h2'

  return (
    <article className={cn('min-w-0', className)}>
      <Link to='/projects/$slug' params={{ slug: project.slug }} className='group/artwork block'>
        <div className='mb-6'>
          <ProjectArt project={project} className='h-71.25 md:h-67.5 lg:h-57.5 xl:h-72.5' />
        </div>
        <p className='mb-3.5 text-sm text-muted-foreground/80'>{project.techstack.join(' · ')}</p>
        <Heading className='mb-4 text-3xl tracking-tight'>{project.title}</Heading>
        <p className='text-muted-foreground'>{project.description}</p>
      </Link>
    </article>
  )
}
