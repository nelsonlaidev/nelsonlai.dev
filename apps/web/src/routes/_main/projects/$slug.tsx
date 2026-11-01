import { ExternalLink } from '@repo/ui/components/external-link'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

import { Mdx } from '@/components/mdx/mdx'
import { orderProjectSpecimens, projectSpecimen } from '@/features/projects/presentation'
import { ProjectArt } from '@/features/projects/project-art'
import { ProjectHeader } from '@/features/projects/project-header'
import { getProject, getProjects } from '@/features/projects/projects.functions'
import { ProjectsError, ProjectsLayout, ProjectsPending } from '@/features/projects/projects-layout'
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

    const ordered = orderProjectSpecimens(summaries)
    const index = ordered.findIndex((item) => item.slug === project.slug)
    const next = ordered.length > 1 ? ordered[(index + 1) % ordered.length] : undefined

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
        dateModified: project.updatedAt,
        slug: project.slug,
        locale,
      }),
    })
  },
  pendingComponent: ProjectsPending,
  errorComponent: ProjectsError,
  component: RouteComponent,
})

function RouteComponent() {
  const { project, next } = Route.useLoaderData()
  const category =
    project.category ??
    {
      developer: m.projects_category_developer(),
      personal: m.projects_category_personal(),
      publishing: m.projects_category_publishing(),
    }[projectSpecimen(project.slug).category]

  return (
    <ProjectsLayout>
      <Link
        to='/projects'
        className='mb-9.5 inline-flex min-h-11 items-center gap-3 text-sm text-[#a9c6bf] min-[701px]:mb-13.75'
      >
        <ArrowLeftIcon className='size-4.25' aria-hidden='true' />
        {m.projects_all()}
      </Link>
      <ProjectHeader
        slug={project.slug}
        title={project.title}
        description={project.subtitle ?? project.description}
        homepage={project.homepage}
        github={project.github}
        category={category}
      />
      <ProjectArt slug={project.slug} large />
      <div className='pt-11.25 min-[701px]:grid min-[701px]:grid-cols-[1fr_2fr] min-[701px]:gap-13.75 min-[701px]:pt-22.5 min-[1101px]:gap-22.5'>
        <aside className='mb-10 self-start border-b pb-7.5 min-[701px]:sticky min-[701px]:top-11.25 min-[701px]:mb-0 min-[701px]:border-0 min-[701px]:pb-0'>
          <span className='mb-6 block text-xs/normal tracking-[0.02em] text-[#b9d4c7]'>{m.projects_essentials()}</span>
          <dl className='grid grid-cols-[75px_minmax(0,1fr)] gap-3.25 text-sm min-[701px]:mt-7.5 min-[701px]:block [&_dd]:leading-[1.9] [&_dd]:text-[#bfd2c8] min-[701px]:[&_dd]:mt-2 [&_dt]:text-[#779e99] min-[701px]:[&_dt]:mt-7'>
            <dt>{m.projects_built_with()}</dt>
            <dd>{project.techstack.join(' · ')}</dd>
            <dt>{m.projects_exploration()}</dt>
            <dd>{category}</dd>
            {project.github && (
              <>
                <dt>{m.projects_code()}</dt>
                <dd>
                  <ExternalLink href={project.github} className='inline-flex items-center gap-2'>
                    {m.projects_repository()}
                    <ArrowRightIcon className='size-3.75 shrink-0' aria-hidden='true' />
                  </ExternalLink>
                </dd>
              </>
            )}
          </dl>
          <p className='mt-6 text-sm/[1.8] text-[#789d98] min-[701px]:mt-10 min-[701px]:max-w-45'>
            {m.projects_art_note()}
          </p>
        </aside>
        <article className='min-w-0'>
          <span className='mb-6 block text-xs/normal tracking-[0.02em] text-[#b9d4c7]'>{m.projects_closer()}</span>
          <h2 className='mb-8.25 text-[38px]/[1.12] font-[410] tracking-tighter min-[701px]:text-[clamp(36px,4.1vw,64px)]'>
            {m.projects_idea_title()}
            <br />
            <em className='font-serif tracking-[-0.04em] text-primary italic'>{m.projects_idea_emphasis()}</em>
          </h2>
          <Mdx
            path={project.path}
            className='max-w-none text-base/[1.65] text-[#aac4bd] *:first:mt-5.75 prose-h2:mt-6.75 prose-h2:mb-3 prose-h2:border-t prose-h2:pt-6.75 prose-h2:text-[19px] prose-h2:font-[450] prose-h2:tracking-tight prose-h3:mt-6.75 prose-h3:mb-3 prose-h3:border-t prose-h3:pt-6.75 prose-h3:text-[19px] prose-h3:font-[450] prose-h3:tracking-tight prose-p:mt-5.75 prose-p:mb-0 prose-a:text-[#d0e0c7]! prose-a:decoration-[#8eae9270] prose-blockquote:my-8.75 prose-blockquote:border-[#8bbbaf] prose-blockquote:py-1 prose-blockquote:pl-6.5 prose-blockquote:font-serif prose-blockquote:text-[23px] prose-blockquote:leading-[1.6] prose-blockquote:text-[#c2d7ca] prose-blockquote:italic! max-[701px]:prose-blockquote:text-[21px] prose-strong:text-inherit prose-code:text-inherit [&_blockquote_p]:m-0'
          />
          {project.features && project.features.length > 0 && (
            <div className='mt-12.5'>
              {project.features.map((feature, index) => (
                <section key={feature.title} className='flex gap-6 border-t py-6.75'>
                  <span className='shrink-0 pt-1 text-sm text-[#789d98]' aria-hidden='true'>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className='min-w-0'>
                    <h3 className='text-lg/[1.4] font-[450] tracking-tight min-[701px]:text-[19px]'>{feature.title}</h3>
                    <p className='mt-3 text-base/[1.65] text-[#9fbbb6]'>{feature.text}</p>
                  </div>
                </section>
              ))}
            </div>
          )}
          {project.journey && (
            <blockquote className='my-8.75 border-l border-[#8bbbaf] py-1 pl-6.5 font-serif text-[21px]/[1.6] text-[#c2d7ca] italic min-[701px]:text-[23px]'>
              {project.journey}
            </blockquote>
          )}
          {project.github && <p className='mt-5.75 text-sm/[1.65] text-[#789d98]'>{m.projects_source_note()}</p>}
        </article>
      </div>
      {next && (
        <Link
          to='/projects/$slug'
          params={{ slug: next.slug }}
          className='mt-16.25 flex items-center justify-between gap-5 border-t pt-8 min-[701px]:mt-27.5 min-[701px]:gap-7.5 min-[701px]:pt-11.25'
        >
          <div className='min-w-0'>
            <span className='mb-6 block text-xs/normal tracking-[0.02em] text-[#b9d4c7]'>{m.projects_next()}</span>
            <h2 className='text-[39px]/[1.12] font-[410] tracking-tighter min-[701px]:text-5xl'>{next.title}</h2>
            <p className='mt-4.5 max-w-130 text-base/[1.65] text-[#93b2aa]'>{next.description}</p>
          </div>
          <ArrowRightIcon className='size-7 shrink-0 min-[701px]:size-10.5' aria-hidden='true' />
        </Link>
      )}
    </ProjectsLayout>
  )
}
