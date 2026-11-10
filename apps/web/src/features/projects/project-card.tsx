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
      <Link
        to='/projects/$slug'
        params={{ slug: project.slug }}
        aria-label={project.title}
        className='group/artwork block'
      >
        <div className='mb-6'>
          <ProjectArt project={project} featured={featured} />
        </div>
        <p
          className={
            featured ? 'mb-3 text-sm text-muted-foreground' : 'mb-3.5 text-sm/relaxed text-muted-foreground/80'
          }
        >
          {project.techstack.join(' · ')}
        </p>
        <Heading className={featured ? 'mb-3 text-2xl font-medium tracking-tight' : 'mb-4 text-3xl tracking-tighter'}>
          {project.title}
        </Heading>
        <p className='text-base/relaxed text-muted-foreground'>{project.description}</p>
      </Link>
    </article>
  )
}
