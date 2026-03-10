'use client'

import type { Project } from 'content-collections'

import { motion, useInView } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { cn } from '@/utils/cn'

import { ProjectCard } from '../project-card'

const variants = {
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
}

type SelectedProjectsProps = {
  projects: Project[]
}

export function SelectedProjects(props: SelectedProjectsProps) {
  const { projects } = props
  const projectsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(projectsRef, { once: true, margin: '-100px' })
  const t = useTranslations()

  return (
    <motion.div
      initial='initial'
      animate={isInView ? 'animate' : 'initial'}
      variants={variants}
      ref={projectsRef}
      transition={{ duration: 0.5 }}
      className='relative my-24'
    >
      <motion.h2
        className='text-center text-3xl font-semibold'
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {t('homepage.selected-projects.title')}
      </motion.h2>
      <motion.div
        className='mt-12 grid gap-4 md:grid-cols-2'
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} featured lazy={false} />
        ))}
      </motion.div>
      <div className='my-8 flex items-center justify-center'>
        <Link href='/projects' className={cn(buttonVariants({ variant: 'outline' }))}>
          {t('homepage.selected-projects.more')}
        </Link>
      </div>
    </motion.div>
  )
}
