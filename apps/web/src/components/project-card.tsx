import type { ProjectSummary } from '@/features/projects/types'

import { Badge } from '@repo/ui/components/badge'
import { LightbulbIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

import { ContentCard } from './content-card'

type ProjectCardProps = {
  project: ProjectSummary
  featured?: boolean
  lazy?: boolean
  showTechstack?: boolean
}

export function ProjectCard(props: ProjectCardProps) {
  const { project, featured = false, lazy = true, showTechstack = false } = props

  return (
    <ContentCard
      key={project.slug}
      to={`/projects/${project.slug}`}
      title={m.project_category()}
      image={`/images/projects/${project.slug}/cover.png`}
      imageAlt=''
      icon={<LightbulbIcon className='size-4.5' />}
      featured={featured}
      lazy={lazy}
    >
      <div className='flex flex-col px-2 py-4 transition-transform ease-out motion-safe:group-hover:translate-x-0.5 motion-reduce:transition-none'>
        <h3 className='text-2xl font-semibold'>{project.title}</h3>
        <p className='mt-2 text-muted-foreground'>{project.description}</p>
        {showTechstack && (
          <div className='mt-3 flex flex-wrap gap-1.5'>
            {project.techstack.map((tech) => (
              <Badge key={tech} variant='outline'>
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </ContentCard>
  )
}
