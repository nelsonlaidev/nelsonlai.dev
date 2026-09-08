import type { Project } from 'content-collections'

import { LightbulbIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Badge } from '@/components/ui/badge'

import { ContentCard } from './content-card'

type ProjectCardProps = {
  project: Project
  featured?: boolean
  lazy?: boolean
  showTechstack?: boolean
}

export function ProjectCard(props: ProjectCardProps) {
  const { project, featured = false, lazy = true, showTechstack = false } = props
  const t = useTranslations()

  return (
    <ContentCard
      key={project.slug}
      href={`/projects/${project.slug}`}
      title={t('homepage.selected-projects.card')}
      image={`/images/projects/${project.slug}/cover.png`}
      imageAlt={project.description}
      icon={<LightbulbIcon className='size-4.5' />}
      featured={featured}
      lazy={lazy}
    >
      <div className='flex flex-col px-2 py-4 transition-transform ease-out group-hover:translate-x-0.5'>
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
