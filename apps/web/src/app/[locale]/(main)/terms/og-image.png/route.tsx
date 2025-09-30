import { routing } from '@repo/i18n/routing'
import { getErrorMessage } from '@repo/utils'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'

import OGImage from '@/components/og-image'
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/constants'
import { getPageBySlug } from '@/lib/content'
import { getOGImageFonts } from '@/lib/fonts'

export const GET = async (_request: Request, props: RouteContext<'/[locale]/terms/og-image.png'>) => {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 })
  }

  const t = await getTranslations({ locale })
  const title = t('terms.title')

  try {
    const page = getPageBySlug(locale, 'terms')

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    const ogImageFonts = await getOGImageFonts(title)

    return new ImageResponse(<OGImage title={title} url='/terms' />, {
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
