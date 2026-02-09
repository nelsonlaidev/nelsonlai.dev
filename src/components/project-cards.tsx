'use client'

import type { Project } from 'content-collections'

import BlurImage from '@/components/blur-image'
import { Link } from '@/components/ui/link'

import { Badge } from './ui/badge'

type ProjectCardProps = Project
type ProjectCardsProps = {
  projects: Project[]
}

function ProjectCards(props: ProjectCardsProps) {
  const { projects } = props

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {projects.map((project) => (
        <ProjectCard key={project.slug} {...project} />
      ))}
    </div>
  )
}

function ProjectCard(props: ProjectCardProps) {
  const { name, description, techstack, slug } = props

  return (
    <Link href={`/projects/${slug}`} className='group rounded-2xl px-2 py-4 shadow-feature-card'>
      <BlurImage
        src={`/images/projects/${slug}/cover.png`}
        width={1200}
        height={630}
        imageClassName='group-hover:scale-105'
        alt={name}
        className='rounded-lg'
      />
      <div className='flex-1 px-2 py-4'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-semibold'>{name}</h2>
          <div className='text-muted-foreground'>{description}</div>
        </div>
        <div className='mt-4 flex flex-wrap gap-2'>
          {techstack.map((label) => (
            <Badge key={label} variant='outline'>
              {label}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default ProjectCards
