import { createFileRoute, notFound } from '@tanstack/react-router'

import { PageHeader } from '@/components/page-header'
import { ProjectCard } from '@/components/project-card'
import { getPage } from '@/features/pages/pages.functions'
import { getProjects } from '@/features/projects/projects.functions'
import { getLocale } from '@/paraglide/runtime'

export const Route = createFileRoute('/_main/projects')({
  loader: async () => {
    const locale = getLocale()
    const [page, projects] = await Promise.all([
      getPage({ data: { slug: 'projects', locale } }),
      getProjects({ data: { locale } }),
    ])

    if (!page) {
      throw notFound()
    }

    return { page, projects }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.page.title} | Nelson Lai` },
          { name: 'description', content: loaderData.page.description },
        ]
      : [],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { page, projects } = Route.useLoaderData()

  return (
    <>
      <PageHeader title={page.title} description={page.description} />
      <div className='grid gap-4 md:grid-cols-2'>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} showTechstack />
        ))}
      </div>
    </>
  )
}
