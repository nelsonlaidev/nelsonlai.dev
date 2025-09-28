import type { Metadata } from 'next'
import type { SoftwareSourceCode, WithContext } from 'schema-dts'

import { setRequestLocale } from '@repo/i18n/server'
import { notFound } from 'next/navigation'

import BlurImage from '@/components/blur-image'
import JsonLd from '@/components/json-ld'
import Mdx from '@/components/mdx'
import { MY_NAME } from '@/lib/constants'
import { allProjects } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

import Header from './header'

export const generateStaticParams = (): Array<{ slug: string; locale: string }> => {
  return allProjects.map((project) => ({
    slug: project.slug,
    locale: project.locale
  }))
}

export const generateMetadata = async (props: PageProps<'/[locale]/projects/[slug]'>): Promise<Metadata> => {
  const { params } = props
  const { slug, locale } = await params

  const project = allProjects.find((p) => p.slug === slug && p.locale === locale)

  if (!project) {
    return {}
  }

  const { name, description, pathname, ogImagePathname } = project

  return createMetadata({
    pathname,
    title: name,
    description,
    locale,
    ogImagePathname
  })
}

const Page = async (props: PageProps<'/[locale]/projects/[slug]'>) => {
  const { params } = props
  const { slug, locale } = await params
  setRequestLocale(locale)

  const project = allProjects.find((p) => p.slug === slug && p.locale === locale)

  if (!project) {
    notFound()
  }

  const { name, code, description, github, dateCreated, pathname, coverImagePathname } = project
  const url = getLocalizedPath({ locale, pathname })
  const baseUrl = getBaseUrl()

  const jsonLd: WithContext<SoftwareSourceCode> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name,
    description,
    url,
    codeRepository: github,
    license: 'https://opensource.org/licenses/MIT',
    programmingLanguage: 'TypeScript',
    dateCreated,
    author: {
      '@type': 'Person',
      name: MY_NAME,
      url: baseUrl
    },
    thumbnailUrl: `${baseUrl}${coverImagePathname}`,
    inLanguage: locale
  }

  return (
    <>
      <JsonLd json={jsonLd} />
      <div className='mx-auto max-w-3xl'>
        <Header {...project} />
        <BlurImage
          src={coverImagePathname}
          width={1200}
          height={630}
          alt={name}
          className='my-12 rounded-lg'
          lazy={false}
        />
        <Mdx code={code} />
      </div>
    </>
  )
}

export default Page
