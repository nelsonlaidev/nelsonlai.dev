import { routing } from '@repo/i18n/routing'
import { getErrorMessage } from '@repo/utils'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'
import { hasLocale } from 'next-intl'

import OGImage from '@/components/og-image'
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/constants'
import { getPostBySlug } from '@/lib/content'
import { getOGImageFonts } from '@/lib/fonts'

export const GET = async (_request: Request, props: RouteContext<'/[locale]/blog/[slug]/og-image.png'>) => {
  const { params } = props
  const { slug, locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 404 })
  }

  try {
    const post = getPostBySlug(locale, slug)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const ogImageFonts = await getOGImageFonts(post.title)

    return new ImageResponse(<OGImage title={post.title} url='/blog' />, {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      fonts: ogImageFonts
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to generate image: ' + getErrorMessage(error)
      },
      { status: 500 }
    )
  }
}
