import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

import { Mdx } from '@/components/mdx/mdx'
import { OceanPage } from '@/components/ocean-page'
import { PagePending } from '@/components/page-pending'
import { RouteError } from '@/components/route-error'
import { ProjectArt } from '@/features/projects/project-art'
import { ProjectHeader } from '@/features/projects/project-header'
import { getProject, getProjects } from '@/features/projects/projects.functions'
import { createJsonLdProject } from '@/lib/json-ld'
import { createSeoHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/projects/$slug')({
  loader: async ({ params }) => {
    const locale = getLocale()
    const [project, summaries] = await Promise.all([
      getProject({ data: { slug: params.slug, locale } }),
      getProjects({ data: { locale } }),
    ])

    if (!project) throw notFound()

    const index = summaries.findIndex((item) => item.slug === project.slug)
    const next = summaries.length > 1 ? summaries[(index + 1) % summaries.length] : undefined

    return { project, locale, next }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const { project, locale } = loaderData
    const pathname = `/projects/${project.slug}` as const

    return createSeoHead({
      title: project.title,
      description: project.description,
      pathname,
      locale,
      jsonLd: createJsonLdProject({
        name: project.title,
        description: project.description,
        pathname,
        codeRepository: project.github,
        schemaType: project.schemaType,
        license: project.license,
        programmingLanguages: project.programmingLanguages,
        dateCreated: project.dateCreated,
        slug: project.slug,
        locale,
      }),
    })
  },
  pendingComponent: () => <PagePending title={m.projects_all()} description={m.projects_intro()} />,
  errorComponent: (props) => (
    <OceanPage>
      <RouteError {...props} />
    </OceanPage>
  ),
  component: RouteComponent,
})

function RouteComponent() {
  const { project, next } = Route.useLoaderData()

  return (
    <OceanPage className={next ? 'pb-0 sm:pb-0' : undefined}>
      <Link to='/projects' className='group mb-10 inline-flex items-center gap-3 text-sm text-link md:mb-14'>
        <ArrowLeftIcon
          className='size-4 motion-safe:transition-transform motion-safe:group-hover:-translate-x-1 motion-safe:group-focus-visible:-translate-x-1'
          aria-hidden='true'
        />
        {m.projects_all()}
      </Link>
      <ProjectHeader
        title={project.title}
        description={project.description}
        homepage={project.homepage}
        github={project.github}
      />
      <ProjectArt project={project} large />
      <article className='mx-auto max-w-prose pt-11 not-last:mb-16 md:pt-24 md:not-last:mb-28'>
        <h2 className='mb-8 text-4xl tracking-tighter lg:text-5xl 2xl:text-6xl'>
          {m.projects_idea_title()}
          <br />
          <em className='font-serif tracking-tighter text-primary italic'>{m.projects_idea_emphasis()}</em>
        </h2>
        <dl className='mb-6 flex flex-wrap items-baseline gap-x-2 text-sm'>
          <dt>{m.projects_built_with()}</dt>
          <dd className='text-muted-foreground'>{project.techstack.join(' · ')}</dd>
        </dl>
        <Mdx code={project.code} className='not-last:mb-12' />
        {project.features && project.features.length > 0 && (
          <div>
            {project.features.map((feature, index) => (
              <section key={feature.title} className='flex gap-6 border-t py-7'>
                <span className='shrink-0 pt-1 text-sm text-muted-foreground/80' aria-hidden='true'>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className='min-w-0'>
                  <h3 className='mb-3 text-lg/snug font-medium tracking-tight'>{feature.title}</h3>
                  <p className='text-base/relaxed text-muted-foreground'>{feature.text}</p>
                </div>
              </section>
            ))}
          </div>
        )}
      </article>
      {next && (
        <Link
          to='/projects/$slug'
          params={{ slug: next.slug }}
          className='group flex items-center justify-between gap-5 border-t pt-14 md:gap-8'
        >
          <div className='min-w-0'>
            <span className='mb-6 block text-xs tracking-wide text-section-label'>{m.projects_next()}</span>
            <h2 className='mb-5 text-4xl tracking-tighter md:text-5xl'>{next.title}</h2>
            <p className='max-w-lg text-base/relaxed text-muted-foreground/80'>{next.description}</p>
          </div>
          <ArrowRightIcon
            className='size-7 shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1 md:size-11'
            aria-hidden='true'
          />
        </Link>
      )}
    </OceanPage>
  )
}
