import type { Metadata } from 'next'
import type { CollectionPage, WithContext } from 'schema-dts'

import { type Locale, useTranslations } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { use } from 'react'

import JsonLd from '@/components/json-ld'
import PageHeader from '@/components/page-header'
import ProjectCards from '@/components/project-cards'
import { MY_NAME } from '@/lib/constants'
import { getLatestProjects } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export async function generateMetadata(props: PageProps<'/[locale]/projects'>): Promise<Metadata> {
  const { params } = props
  const { locale } = await params

  const t = await getTranslations({ locale: locale as Locale })
  const title = t('common.labels.projects')
  const description = t('projects.description')

  return createMetadata({
    pathname: '/projects',
    title,
    description,
    locale,
  })
}

function Page(props: PageProps<'/[locale]/projects'>) {
  const { params } = props
  const { locale } = use(params)

  setRequestLocale(locale as Locale)

  const t = useTranslations()
  const title = t('common.labels.projects')
  const description = t('projects.description')
  const url = getLocalizedPath({ locale, pathname: '/projects' })

  const projects = getLatestProjects(locale)

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    name: title,
    description,
    url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => ({
        '@type': 'SoftwareSourceCode',
        name: project.name,
        description: project.description,
        url: `${url}/${project.slug}`,
        position: index + 1,
      })),
    },
    isPartOf: {
      '@type': 'WebSite',
      name: MY_NAME,
      url: getBaseUrl(),
    },
    inLanguage: locale,
  }

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageHeader title={title} description={description} />
      <ProjectCards projects={projects} />
    </>
  )
}

export default Page
