import type { ProjectSummary } from '@/features/projects/types'

import { buttonVariants } from '@repo/ui/components/button'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

import { ProjectCard } from '@/components/project-card'
import { m } from '@/paraglide/messages'

const variants = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
}

type SelectedProjectsProps = {
  projects: ProjectSummary[]
}

export function SelectedProjects(props: SelectedProjectsProps) {
  const { projects } = props
  const reducedMotion = useReducedMotion()
  const projectsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(projectsRef, { once: true, margin: '-100px' })

  return (
    <motion.div
      initial='initial'
      animate={reducedMotion || isInView ? 'animate' : 'initial'}
      variants={variants}
      ref={projectsRef}
      transition={{ duration: reducedMotion ? 0 : 0.5 }}
      className='relative my-24'
    >
      <motion.h2
        className='text-center text-3xl font-semibold'
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
      >
        {m.selected_projects_title()}
      </motion.h2>
      <motion.div
        className='mt-12 grid gap-4 md:grid-cols-2'
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} featured lazy={false} />
        ))}
      </motion.div>
      <div className='my-8 flex items-center justify-center'>
        <Link to='/projects' className={cn(buttonVariants({ variant: 'outline' }))}>
          {m.selected_projects_view_all()}
        </Link>
      </div>
    </motion.div>
  )
}
