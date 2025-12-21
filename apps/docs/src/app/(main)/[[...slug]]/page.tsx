import type { Metadata } from 'next'

import { Badge } from '@repo/ui/components/badge'
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page'
import { createRelativeLink } from 'fumadocs-ui/mdx'
import { ArrowUpRightIcon } from 'lucide-react'
import { notFound } from 'next/navigation'

import { getPageImage, source } from '@/lib/source'
import { getMDXComponents } from '@/mdx-components'

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: PageProps<'/[[...slug]]'>): Promise<Metadata> {
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

async function Page(props: PageProps<'/[[...slug]]'>) {
  const { params } = props
  const { slug } = await params

  const page = source.getPage(slug)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className='mb-0'>{page.data.description}</DocsDescription>
      {(page.data.docs !== undefined || page.data.api !== undefined) && (
        <div className='flex items-center gap-2'>
          {page.data.docs && (
            <Badge variant='secondary' className='rounded-full' asChild>
              <a href={page.data.docs} target='_blank' rel='noopener noreferrer'>
                Docs <ArrowUpRightIcon />
              </a>
            </Badge>
          )}
          {page.data.api && (
            <Badge variant='secondary' className='rounded-full' asChild>
              <a href={page.data.api} target='_blank' rel='noopener noreferrer'>
                API Reference <ArrowUpRightIcon />
              </a>
            </Badge>
          )}
        </div>
      )}
      <DocsBody className='mt-4'>
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
