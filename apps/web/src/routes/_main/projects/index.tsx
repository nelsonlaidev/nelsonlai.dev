import { createFileRoute, notFound } from '@tanstack/react-router'

import { PageHeader } from '@/components/page-header'
import { ProjectCard } from '@/components/project-card'
import { ENV } from '@/env'
import { getPage } from '@/features/pages/pages.functions'
import { getProjects } from '@/features/projects/projects.functions'
import { createSeoHead, getLocalizedUrl } from '@/lib/seo'
import { SITE } from '@/lib/site'
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
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': getLocalizedUrl('/projects', loaderData.locale),
        name: loaderData.page.title,
        description: loaderData.page.description,
        url: getLocalizedUrl('/projects', loaderData.locale),
        isPartOf: { '@type': 'WebSite', name: SITE.name, url: ENV.SITE_URL },
        inLanguage: loaderData.locale,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: loaderData.projects.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: project.title,
            url: getLocalizedUrl(`/projects/${project.slug}`, loaderData.locale),
          })),
        },
      },
    })
  },
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
