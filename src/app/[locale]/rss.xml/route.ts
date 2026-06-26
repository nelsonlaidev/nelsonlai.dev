import { NextResponse } from 'next/server'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import RSS from 'rss'

import { MY_NAME } from '@/constants/site'
import { routing } from '@/i18n/routing'
import { getPosts } from '@/lib/content'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export const dynamic = 'force-static'

export async function GET(_request: Request, props: RouteContext<'/[locale]/rss.xml'>) {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 404 })
  }

  const t = await getTranslations({ locale })
  const baseUrl = getBaseUrl()

  const feed = new RSS({
    title: MY_NAME,
    description: t('metadata.site-description'),
    site_url: `${baseUrl}${getLocalizedPath('/', locale)}`,
    feed_url: `${baseUrl}${getLocalizedPath('/rss.xml', locale)}`,
    language: locale,
    image_url: `${baseUrl}/images/banner.png`,
    copyright: `© ${new Date().getFullYear()} ${MY_NAME}. All rights reserved.`,
    webMaster: 'me@nelsonlai.dev',
  })

  const posts = getPosts(locale)

  for (const post of posts) {
    const slugPath = `/blog/${post.slug}`

    feed.item({
      title: post.title,
      url: `${baseUrl}${getLocalizedPath(slugPath, locale)}`,
      date: post.date,
      description: post.description,
      author: MY_NAME,
    })
  }

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
