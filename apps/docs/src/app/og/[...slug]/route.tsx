import { generate as DefaultImage } from 'fumadocs-ui/og'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'

import { getPageImage, source } from '@/lib/source'

export const GET = async (_request: Request, props: RouteContext<'/og/[...slug]'>) => {
  const { params } = props
  const { slug } = await params

  const page = source.getPage(slug.slice(0, -1))
  if (!page) notFound()

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site='@nelsonlaidev/docs' />,
    {
      width: 1200,
      height: 630
    }
  )
}

export const generateStaticParams = () => {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImage(page).segments
  }))
}
