import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowRightIcon } from 'lucide-react'
import { useState } from 'react'

import { getPage } from '@/features/pages/pages.functions'
import { orderProjectSpecimens, projectSpecimen } from '@/features/projects/presentation'
import { ProjectArt } from '@/features/projects/project-art'
import { getProjects } from '@/features/projects/projects.functions'
import { ProjectsError, ProjectsLayout, ProjectsPending } from '@/features/projects/projects-layout'
import { createJsonLdCollectionPage } from '@/lib/json-ld'
import { createSeoHead, getLocalizedUrl } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/projects/')({
  loader: async () => {
    const locale = getLocale()
    const [page, projects] = await Promise.all([
      getPage({ data: { slug: 'projects', locale } }),
      getProjects({ data: { locale } }),
    ])

    if (!page) throw notFound()

    return { page, projects, locale }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    return createSeoHead({
      title: loaderData.page.title,
      description: loaderData.page.description,
      pathname: '/projects',
      locale: loaderData.locale,
      jsonLd: createJsonLdCollectionPage({
        title: loaderData.page.title,
        description: loaderData.page.description,
        pathname: '/projects',
        locale: loaderData.locale,
        items: loaderData.projects.map((project) => ({
          name: project.title,
          url: getLocalizedUrl(`/projects/${project.slug}`, loaderData.locale),
        })),
      }),
    })
  },
  component: RouteComponent,
  errorComponent: ProjectsError,
  pendingComponent: ProjectsPending,
})

function RouteComponent() {
  const { page, projects } = Route.useLoaderData()
  const [category, setCategory] = useState('all')
  const categories = [
    { value: 'all', label: m.ocean_all_projects() },
    { value: 'developer', label: m.projects_category_developer() },
    { value: 'personal', label: m.projects_category_personal() },
    { value: 'publishing', label: m.projects_category_publishing() },
  ]
  const visible = orderProjectSpecimens(projects).filter(
    (project) => category === 'all' || projectSpecimen(project.slug).category === category,
  )

  return (
    <ProjectsLayout>
      <div className='mb-12.5 min-[701px]:mb-18.75'>
        <span className='mb-6 block text-xs/normal tracking-[0.02em] text-[#b9d4c7]'>
          01 / {m.projects_collection()}
        </span>
        <h1 className='text-[clamp(48px,5.8vw,86px)] leading-[1.04] font-[420] tracking-[-0.065em] max-[701px]:text-[46px]'>
          {page.title}
        </h1>
        <p className='mt-6 max-w-150 text-lg/[1.65] text-[#b1cbc4] min-[701px]:mt-7'>
          {m.projects_intro_first()}
          <br />
          {m.projects_intro_second()}
        </p>
      </div>
      <div className='mb-7.5 flex flex-col items-start justify-between gap-5 border-b pb-5.5 min-[701px]:mb-11.25 min-[701px]:flex-row min-[701px]:items-center'>
        <fieldset aria-label={m.projects_filter()} className='flex flex-wrap gap-0.75 min-[701px]:gap-1.75'>
          {categories.map((item) => (
            <button
              key={item.value}
              type='button'
              onClick={() => {
                setCategory(item.value)
              }}
              aria-pressed={item.value === category}
              className='min-h-11 cursor-pointer rounded-md border border-transparent px-2.75 py-2 text-sm/normal text-[#91b2aa] hover:text-foreground aria-pressed:border-[#b3d4c53b] aria-pressed:bg-[#b3d4c50a] aria-pressed:text-foreground min-[701px]:px-3.75 min-[701px]:py-2.25'
            >
              {item.label}
            </button>
          ))}
        </fieldset>
        <span aria-live='polite' className='shrink-0 text-sm/normal text-[#8cafaa]'>
          {visible.length === 1
            ? m.projects_count_one({ count: visible.length })
            : m.projects_count({ count: visible.length })}
        </span>
      </div>
      <div className='grid gap-11.25 min-[701px]:grid-cols-2 min-[701px]:gap-x-7 min-[1001px]:grid-cols-3 min-[1001px]:gap-5.75 min-[1101px]:gap-7.5'>
        {visible.map((project) => (
          <article key={project.slug} className='group/artwork min-w-0'>
            <Link
              to='/projects/$slug'
              params={{ slug: project.slug }}
              aria-label={project.title}
              className='group group/artwork block'
            >
              <ProjectArt slug={project.slug} />
            </Link>
            <div className='mt-5.5 mb-3.5 flex justify-between gap-3 text-sm/[1.7] text-[#97b9b1]'>
              <span>{project.techstack.join(' · ')}</span>
              <span>{String(projectSpecimen(project.slug).number).padStart(2, '0')}</span>
            </div>
            <h2 className='mb-4 text-[31px]/[1.12] font-[410] tracking-tighter min-[701px]:text-3xl'>
              <Link to='/projects/$slug' params={{ slug: project.slug }}>
                {project.title}
              </Link>
            </h2>
            <p className='text-base/[1.65] text-[#a7c2bb]'>{project.description}</p>
            <Link
              to='/projects/$slug'
              params={{ slug: project.slug }}
              className='mt-6.25 flex min-h-11 items-center justify-between gap-4 border-t pt-4 text-sm'
            >
              {m.ocean_project_cta()}
              <ArrowRightIcon className='size-5 shrink-0' aria-hidden='true' />
            </Link>
          </article>
        ))}
      </div>
      {visible.length === 0 && <p className='text-muted-foreground'>{m.ocean_empty_projects()}</p>}
      <aside className='mt-16.25 flex flex-wrap items-center gap-4.5 border-y py-8.75 min-[701px]:mt-23.75 min-[701px]:gap-6.25'>
        <span className='hidden size-1.5 shrink-0 rounded-full bg-primary min-[701px]:block' aria-hidden='true' />
        <div>
          <h2 className='text-[22px] font-[410] tracking-tight min-[701px]:text-[21px]'>{m.projects_more_title()}</h2>
          <p className='mt-2.25 text-base/[1.65] text-[#90b2ab]'>{m.projects_more_description()}</p>
        </div>
        <Link to='/blog' className='inline-flex min-h-11 items-center gap-3.75 text-sm min-[1001px]:ml-auto'>
          {m.projects_read_blog()}
          <ArrowRightIcon className='size-5' aria-hidden='true' />
        </Link>
      </aside>
    </ProjectsLayout>
  )
}
