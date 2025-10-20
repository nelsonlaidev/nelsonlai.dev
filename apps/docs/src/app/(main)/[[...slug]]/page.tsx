import type { Metadata } from 'next'

import { createRelativeLink } from 'fumadocs-ui/mdx'
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'

import { getPageImage, source } from '@/lib/source'
import { getMDXComponents } from '@/mdx-components'

export const generateStaticParams = () => {
  return source.generateParams()
}

export const generateMetadata = async (props: PageProps<'/[[...slug]]'>): Promise<Metadata> => {
  const { params } = props
  const { slug } = await params

  const page = source.getPage(slug)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url
    }
  }
}

const Page = async (props: PageProps<'/[[...slug]]'>) => {
  const { params } = props
  const { slug } = await params

  const page = source.getPage(slug)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page)
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}

export default Page
