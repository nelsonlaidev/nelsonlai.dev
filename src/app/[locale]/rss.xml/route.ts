import { allPosts } from 'content-collections'
import { NextResponse } from 'next/server'
import { hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import RSS from 'rss'

import { routing } from '@/i18n/routing'
import { MY_NAME } from '@/lib/constants'
import { getLocalizedPath } from '@/utils/get-localized-path'

export const dynamic = 'force-static'

export async function GET(_request: Request, props: RouteContext<'/[locale]/rss.xml'>) {
  const { params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 404 })
  }

  const t = await getTranslations({ locale })

  const feed = new RSS({
    title: MY_NAME,
    description: t('metadata.site-description'),
    site_url: getLocalizedPath({ locale }),
    feed_url: getLocalizedPath({ locale, pathname: '/rss.xml' }),
    language: locale,
    image_url: getLocalizedPath({ locale, pathname: '/og/image.webp' }),
    copyright: `© ${new Date().getFullYear()} ${MY_NAME}. All rights reserved.`,
    webMaster: 'me@nelsonlai.dev',
  })

  const posts = allPosts.filter((p) => p.locale === locale)

  for (const post of posts) {
    feed.item({
      title: post.title,
      url: getLocalizedPath({ locale, pathname: `/blog/${post.slug}` }),
      date: post.date,
      description: post.summary,
      author: MY_NAME,
    })
  }

  return new NextResponse(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
