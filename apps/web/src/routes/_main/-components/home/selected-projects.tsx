import type { ProjectSummary } from '@/features/projects/types'

import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { ArrowRightIcon } from 'lucide-react'

import { m } from '@/paraglide/messages'

import { SectionHeading } from './section-heading'

type SelectedProjectsProps = {
  projects: ProjectSummary[]
}

export function SelectedProjects(props: SelectedProjectsProps) {
  const { projects } = props

  return (
    <section
      id='discoveries'
      aria-labelledby='discoveries-title'
      className='mx-auto w-full max-w-400 scroll-mt-12.5 py-25 pr-[max(16px,env(safe-area-inset-right))] pl-[max(16px,env(safe-area-inset-left))] min-[701px]:scroll-mt-17.5 min-[701px]:px-[10%] min-[701px]:py-37.5'
    >
      <SectionHeading
        id='discoveries-title'
        eyebrow={`01 / ${m.nav_projects()}`}
        title={m.home_projects_title()}
        emphasis={m.home_projects_emphasis()}
        description={m.home_projects_description()}
      />
      <div className='grid gap-12 min-[701px]:grid-cols-3 min-[701px]:gap-7.5'>
        {projects.map((project, index) => (
          <article key={project.slug} className='min-w-0 min-[701px]:nth-2:pt-15 min-[701px]:nth-3:pt-30'>
            <Link
              to='/projects/$slug'
              params={{ slug: project.slug }}
              aria-label={`${project.title}: ${String(index + 1).padStart(2, '0')} ${m.home_projects_selected()}`}
              className='group group/row relative block'
            >
              <div
                aria-hidden='true'
                className='relative h-67.5 overflow-hidden border border-[#b2d7ca20] [background:radial-gradient(ellipse_at_50%_100%,#408c8e35,transparent_70%),#c0e0d505] after:pointer-events-none after:absolute after:inset-0 after:content-[""] after:[background:linear-gradient(125deg,#d3edce10,transparent_60%)] max-[1001px]:h-55 max-[701px]:h-71.25'
              >
                <span
                  className={cn(
                    'absolute top-1/2 left-1/2 border border-[#bcd4bd55]',
                    (index % 3 === 0 || index % 3 === 2) &&
                      'size-43.75 transform-[translate(-50%,-50%)_rotate(-30deg)_scaleY(0.4)] rounded-full',
                    index % 3 === 1 && 'size-37.5 transform-[translate(-50%,-50%)_rotate(-25deg)] rounded-[10%]',
                    index % 3 === 2 && 'hidden',
                  )}
                />
                <span
                  className={cn(
                    'absolute top-1/2 left-1/2 border border-[#bcd4bd28]',
                    (index % 3 === 0 || index % 3 === 2) &&
                      'size-50 transform-[translate(-50%,-50%)_rotate(45deg)_scaleY(0.5)] rounded-full',
                    index % 3 === 1 && 'size-47.5 transform-[translate(-50%,-50%)_rotate(-25deg)] rounded-[10%]',
                    index % 3 === 2 && 'hidden',
                  )}
                />
                <span
                  className={cn(
                    'absolute top-1/2 left-1/2 transition-transform duration-800 ease-linear group-hover/row:transform-[translate(-50%,-55%)_rotate(8deg)] group-focus-visible/row:transform-[translate(-50%,-55%)_rotate(8deg)] motion-reduce:transition-none',
                    (index % 3 === 0 || index % 3 === 2) && 'transform-[translate(-50%,-50%)] rounded-full',
                    index % 3 === 0 &&
                      'shadow-[16px_20px_35px_#001d3160,inset_-6px_-3px_15px_#092e3e] [background:radial-gradient(circle_at_32%_25%,#e0e8c8,#7eafa4_30%,#235663_65%,#0a2e3b)]',
                    (index % 3 === 0 || index % 3 === 1) && 'size-25',
                    index % 3 === 1 &&
                      'transform-[translate(-50%,-50%)_rotate(-25deg)] rounded-[18%] shadow-[12px_12px_0_#255061,22px_23px_25px_#00132255] [background:linear-gradient(140deg,#8bb6ad,#356978_50%,#082c46)]',
                    index % 3 === 2 &&
                      'size-30 shadow-[inset_12px_12px_25px_#c5d3b45e,inset_-18px_-12px_30px_#062f4b] [background:repeating-conic-gradient(from_10deg,#a9b9aa_0deg,#477e7f_4deg,#184a59_9deg,#91b1a3_13deg)]',
                  )}
                />
                <span className='absolute top-4.5 left-4.75 text-xs text-[#94bab3]'>
                  {String(index + 1).padStart(2, '0')}
                </span>{' '}
                <span className='absolute bottom-4.75 left-4.75 text-xs text-[#88aaa5]'>
                  {m.home_projects_selected()}
                </span>
              </div>
            </Link>
            <p className='mt-5.5 text-sm text-muted-foreground'>{project.techstack.join(' · ')}</p>
            <h3 className='mt-3 text-[27px] font-[450] tracking-tight min-[701px]:text-[25px]'>
              <Link to='/projects/$slug' params={{ slug: project.slug }}>
                {project.title}
              </Link>
            </h3>
            <p className='mt-3 text-base/[1.65] text-muted-foreground'>{project.description}</p>
            <Link
              to='/projects/$slug'
              params={{ slug: project.slug }}
              className='mt-6 flex min-h-11 items-center justify-between gap-4 border-t pt-4 text-sm'
            >
              {m.projects_explore()}
              <ArrowRightIcon className='size-5 shrink-0' aria-hidden='true' />
            </Link>
          </article>
        ))}
      </div>
      {projects.length === 0 && <p className='text-muted-foreground'>{m.projects_empty()}</p>}
      <Link to='/projects' className='mt-8 inline-flex min-h-11 items-center gap-3 text-sm text-primary'>
        {m.projects_all()}
        <ArrowRightIcon className='size-5' aria-hidden='true' />
      </Link>
    </section>
  )
}
