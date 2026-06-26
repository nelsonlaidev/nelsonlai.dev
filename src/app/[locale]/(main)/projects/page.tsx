import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import { JsonLd } from '@/components/json-ld'
import { PageHeader } from '@/components/page-header'
import { ProjectCard } from '@/components/project-card'
import { getLatestProjects, getSite } from '@/lib/content'
import { createJsonLdCollectionPage } from '@/lib/json-ld'
import { createPageMetadata } from '@/lib/metadata'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(props: PageProps<'/[locale]/projects'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const page = getSite('projects', locale)

  if (!page) return {}

  return createPageMetadata({
    title: page.title,
    description: page.description,
    canonical: '/projects',
    openGraphImage: page.opengraphImage.url,
    locale: locale as Locale,
  })
}

function Page(props: PageProps<'/[locale]/projects'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const page = getSite('projects', locale)
  const url = getLocalizedPath('/projects', locale as Locale)

  if (!page) notFound()

  const { title, description } = page

  const projects = getLatestProjects(locale)

  const jsonLd = createJsonLdCollectionPage({
    id: url,
    title,
    description,
    url,
    locale: locale as Locale,
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
