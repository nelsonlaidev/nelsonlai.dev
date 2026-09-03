import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import { getLocale } from 'next-intl/server'

import { JsonLd } from '@/components/json-ld'
import { PageHeader } from '@/components/page-header'
import { ProjectCard } from '@/components/project-card'
import { getLatestProjects, getSite } from '@/lib/content'
import { createJsonLdCollectionPage } from '@/lib/json-ld'
import { createPageMetadata } from '@/lib/metadata'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()

  const page = getSite('projects', locale)

  if (!page) return {}

  return createPageMetadata({
    title: page.title,
    description: page.description,
    canonical: '/projects',
    openGraphImage: page.opengraphImage.url,
    locale,
  })
}

async function Page() {
  const locale = await getLocale()

  const page = getSite('projects', locale)
  const url = getLocalizedPath('/projects', locale)

  if (!page) notFound()

  const { title, description } = page

  const projects = getLatestProjects(locale)

  const jsonLd = createJsonLdCollectionPage({
    id: url,
    title,
    description,
    url,
    locale,
    items: projects.map((project, index) => ({
      '@type': 'SoftwareSourceCode' as const,
      name: project.title,
      description: project.description,
      url: `${url}/${project.slug}`,
      dateCreated: project.date,
      dateModified: project.lastModified,
      position: index + 1,
    })),
  })

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />
      <div className='grid gap-4 md:grid-cols-2'>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </>
  )
}

export default Page
