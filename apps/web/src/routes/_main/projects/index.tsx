import { createFileRoute, notFound } from '@tanstack/react-router'

import { OceanPage } from '@/components/ocean-page'
import { PageHeader } from '@/components/page-header'
import { getPage } from '@/features/pages/pages.functions'
import { ProjectCard } from '@/features/projects/project-card'
import { getProjects } from '@/features/projects/projects.functions'
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

    const { page, projects, locale } = loaderData

    return createSeoHead({
      title: page.title,
      description: page.description,
      pathname: '/projects',
      locale,
      jsonLd: createJsonLdCollectionPage({
        title: page.title,
        description: page.description,
        pathname: '/projects',
        locale,
        items: projects.map((project) => ({
          item: {
            '@type': project.schemaType,
            name: project.title,
            description: project.description,
            url: getLocalizedUrl(`/projects/${project.slug}`, locale),
            dateCreated: project.dateCreated,
          },
        })),
      }),
    })
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { page, projects } = Route.useLoaderData()

  return (
    <OceanPage>
      <PageHeader title={page.title} description={m.projects_intro()} />
      <div className='grid gap-11 md:grid-cols-2 md:gap-x-7 lg:grid-cols-3 lg:gap-6 xl:gap-8'>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      {projects.length === 0 && <p className='text-muted-foreground'>{m.projects_empty()}</p>}
    </OceanPage>
  )
}
