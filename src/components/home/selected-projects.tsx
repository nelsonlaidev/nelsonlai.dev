'use client'

import type { Project } from 'content-collections'

import { ArrowUpRightIcon, LightbulbIcon } from 'lucide-react'
import { motion, useInView } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

import BlurImage from '@/components/blur-image'
import { buttonVariants } from '@/components/ui/button'
import { Link } from '@/components/ui/link'
import { cn } from '@/utils/cn'

const variants = {
  initial: {
    y: 40,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
}

type CardProps = {
  project: Project
}

type SelectedProjectsProps = {
  projects: Project[]
}

function SelectedProjects(props: SelectedProjectsProps) {
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
      transition={{
        duration: 0.5,
      }}
      className='relative my-24'
    >
      <motion.h2
        className='text-center text-3xl font-semibold'
        initial={{
          y: 30,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        {t('homepage.selected-projects.title')}
      </motion.h2>
      <motion.div
        className='mt-12 grid gap-4 md:grid-cols-2'
        initial={{
          y: 40,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
        }}
      >
        {projects.map((project) => (
          <Card key={project.slug} project={project} />
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

function Card(props: CardProps) {
  const { project } = props
  const { slug, name, description } = project
  const t = useTranslations()

  return (
    <Link key={slug} href={`/projects/${slug}`} className='group relative rounded-2xl p-2 shadow-feature-card'>
      <div className='flex items-center justify-between p-4'>
        <div className='flex items-center gap-3'>
          <LightbulbIcon className='size-4.5' />
          <h2>{t('homepage.selected-projects.card')}</h2>
        </div>
        <ArrowUpRightIcon className='size-4.5 opacity-0 transition-opacity group-hover:opacity-100' />
      </div>
      <BlurImage
        width={1200}
        height={630}
        src={`/images/projects/${slug}/cover.png`}
        alt={description}
        className='rounded-lg'
        lazy={false}
        fetchPriority='high'
      />
      <div className='absolute bottom-6 left-7 flex flex-col transition-[left] ease-out group-hover:left-8'>
        <h3 className='text-2xl font-semibold text-white'>{name}</h3>
        <p className='mt-2 text-neutral-200 dark:text-muted-foreground'>{description}</p>
      </div>
    </Link>
  )
}

export default SelectedProjects
