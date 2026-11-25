import type { ProjectSummary } from '@/features/projects/types'

import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'

import { ProjectCard } from '@/features/projects/project-card'
import { m } from '@/paraglide/messages'

import { Section } from './section'
import { SectionHeading } from './section-heading'

type SelectedProjectsProps = {
  projects: ProjectSummary[]
}

export function SelectedProjects(props: SelectedProjectsProps) {
  const { projects } = props

  return (
    <Section id='projects' className='py-24 md:py-36'>
      <SectionHeading
        id='projects-title'
        className='mb-10 md:mb-16'
        title={m.home_projects_title()}
        emphasis={m.home_projects_emphasis()}
        description={m.home_projects_description()}
      />
      <div className='mb-8 grid gap-12 md:grid-cols-3 md:gap-8'>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} featured className='md:nth-2:pt-16 md:nth-3:pt-32' />
        ))}
        {projects.length === 0 && <p className='col-span-full text-muted-foreground'>{m.projects_empty()}</p>}
      </div>
      <Link to='/projects' className='group inline-flex items-center gap-2 text-sm text-primary'>
        {m.projects_all()}
        <ArrowRightIcon
          className='size-5 motion-safe:transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1'
          aria-hidden='true'
        />
      </Link>
    </Section>
  )
}
