import type { Metadata } from 'next'
import type { Locale } from 'next-intl'

import { allProjects } from 'content-collections'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import { BlurImage } from '@/components/blur-image'
import { JsonLd } from '@/components/json-ld'
import { Mdx } from '@/components/mdx'
import { ProjectHeader } from '@/components/project-header'
import { getProject } from '@/lib/content'
import { createJsonLdSoftwareSourceCode } from '@/lib/json-ld'
import { createPageMetadata } from '@/lib/metadata'
import { getLocalizedPath } from '@/utils/get-localized-path'

export function generateStaticParams(): Array<{ slug: string; locale: string }> {
  return allProjects.map((project) => ({
    slug: project.slug,
    locale: project.locale,
  }))
}

export async function generateMetadata(props: PageProps<'/[locale]/projects/[slug]'>): Promise<Metadata> {
  const { params } = props
  const { slug, locale } = await params

  const project = getProject(slug, locale)

  if (!project) return {}

  return createPageMetadata({
    title: project.title,
    description: project.description,
    canonical: `/projects/${slug}`,
    openGraphImage: project.opengraphImage.url,
    locale: locale as Locale,
    date: project.date,
    lastModified: project.lastModified,
  })
}

function Page(props: PageProps<'/[locale]/projects/[slug]'>) {
  const { params } = props
  const { slug, locale } = use(params)

  setRequestLocale(locale as Locale)

  const project = getProject(slug, locale)
  const url = getLocalizedPath(`/projects/${slug}`, locale as Locale)

  if (!project) {
    notFound()
  }

  const { title, code, description, github, date, lastModified } = project

  const jsonLd = createJsonLdSoftwareSourceCode({
    name: title,
    description,
    url,
    codeRepository: github,
    dateCreated: date,
    dateModified: lastModified,
    slug,
    locale: locale as Locale,
  })

  return (
    <>
      <JsonLd json={jsonLd} />
      <div className='mx-auto max-w-3xl'>
        <ProjectHeader {...project} />
        <BlurImage
          src={`/images/projects/${slug}/cover.png`}
          width={1200}
          height={630}
          alt={title}
          className='my-12 rounded-lg'
          lazy={false}
        />
        <Mdx code={code} />
      </div>
    </>
  )
}

export default Page
