import type { Project } from 'content-collections'

import { buttonVariants } from '@repo/ui/components/button'
import { ExternalLink } from '@repo/ui/components/external-link'
import { cn } from 'cn'
import { ArrowUpRightIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { m } from '@/paraglide/messages'

type ProjectHeaderProps = Pick<Project, 'title' | 'description' | 'homepage' | 'github'>

const variants = {
  hide: { x: -30, opacity: 0 },
  show: { x: 0, opacity: 1 },
}

export function ProjectHeader(props: ProjectHeaderProps) {
  const { title, description, homepage, github } = props
  const reducedMotion = useReducedMotion()
  const repository = github ? new URL(github).pathname.replaceAll(/^\/|\/$/g, '') : undefined

  return (
    <div className='space-y-8 pt-10'>
      <motion.div
        className='flex flex-col gap-3'
        variants={variants}
        initial={reducedMotion ? false : 'hide'}
        animate='show'
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
      >
        <h1 className='text-3xl font-semibold'>{title}</h1>
        <p className='text-muted-foreground'>{description}</p>
      </motion.div>
      {(homepage ?? github) && (
        <motion.div
          className='flex flex-col items-start gap-2 sm:flex-row sm:gap-4'
          variants={variants}
          initial={reducedMotion ? false : 'hide'}
          animate='show'
          transition={{ duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : 0.1 }}
        >
          {homepage && (
            <ExternalLink href={homepage} className={cn(buttonVariants(), 'group')}>
              {m.projects_visit_website()}
              <ArrowUpRightIcon
                className='size-5 transition-transform motion-safe:group-hover:-rotate-12 motion-reduce:transition-none'
                aria-hidden='true'
              />
            </ExternalLink>
          )}
          {github && (
            <ExternalLink href={github} className={cn(buttonVariants(), 'group')}>
              {repository}
              <ArrowUpRightIcon
                className='size-5 transition-transform motion-safe:group-hover:-rotate-12 motion-reduce:transition-none'
                aria-hidden='true'
              />
            </ExternalLink>
          )}
        </motion.div>
      )}
    </div>
  )
}
