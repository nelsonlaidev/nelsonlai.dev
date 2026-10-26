import type { Locale } from '@/paraglide/runtime'

import { Logo } from '@repo/ui/components/logo'
import { createFileRoute } from '@tanstack/react-router'
import { allPosts, allProjects } from 'content-collections'
import { googleFonts } from 'takumi-js/helpers'
import { ImageResponse } from 'takumi-js/response'

import { findPage } from '@/features/pages/pages.server'
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/og'
import { SITE } from '@/lib/site'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

const TYPOGRAPHY_BY_LOCALE: Record<Locale, { fontFamily: string; lang: string }> = {
  en: { fontFamily: 'Geist', lang: 'en' },
  'zh-TW': { fontFamily: 'Noto Sans TC', lang: 'zh-Hant' },
  'zh-CN': { fontFamily: 'Noto Sans SC', lang: 'zh-Hans' },
  ja: { fontFamily: 'Noto Sans JP', lang: 'ja' },
  'pt-BR': { fontFamily: 'Geist', lang: 'pt-BR' },
  es: { fontFamily: 'Geist', lang: 'es' },
}

export const Route = createFileRoute('/og/$')({
  server: {
    handlers: {
      GET: ({ params }) => {
        const pathSegments = (params._splat ?? '').split('/')

        if (pathSegments.pop() !== 'image.webp') {
          return new Response('Image not found', { status: 404 })
        }

        const locale = getLocale()
        const contentPath = pathSegments.join('/')

        let content: { title: string; description: string } | null | undefined
        let categoryLabel: string | undefined

        if (!contentPath) {
          content = { title: SITE.name, description: m.metadata_site_description({}, { locale }) }
        } else if (contentPath.startsWith('blog/')) {
          content = allPosts.find((post) => post.locale === locale && post.slug === contentPath.slice('blog/'.length))
          categoryLabel = m.article_category({}, { locale })
        } else if (contentPath.startsWith('projects/')) {
          content = allProjects.find(
            (project) => project.locale === locale && project.slug === contentPath.slice('projects/'.length),
          )
          categoryLabel = m.project_category({}, { locale })
        } else {
          content = findPage(contentPath, locale)
        }

        if (!content) {
          return new Response('Content not found', { status: 404 })
        }

        const { fontFamily, lang } = TYPOGRAPHY_BY_LOCALE[locale]

        let titleFontSize = 64

        if (content.title.length > 80) titleFontSize = 48
        else if (content.title.length > 40) titleFontSize = 56

        return new ImageResponse(
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              width: '100%',
              height: '100%',
              padding: 80,
              overflow: 'hidden',
              fontFamily,
              color: 'white',
              background: 'black',
            }}
          >
            <svg width={OG_IMAGE_WIDTH} height={OG_IMAGE_HEIGHT} style={{ position: 'absolute', inset: 0 }} fill='none'>
              <path d='M40 0v630M1160 0v630M0 40h1200M0 590h1200' stroke='#26292d' />
              <path
                d='M34 40h12M40 34v12M1154 40h12M1160 34v12M34 590h12M40 584v12M1154 590h12M1160 584v12'
                stroke='#53575d'
              />
            </svg>

            <Logo width={26} height={30} />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 'auto',
                minHeight: 0,
                flexShrink: 0,
              }}
            >
              {categoryLabel && (
                <p style={{ margin: 0, marginBottom: 20, fontSize: 28, lineHeight: 1.4, color: '#f3f3f3' }}>
                  {categoryLabel}
                </p>
              )}
              <p
                style={{
                  margin: 0,
                  marginBottom: 16,
                  fontSize: titleFontSize,
                  fontWeight: 500,
                  letterSpacing: -1.5,
                  lineHeight: 1.25,
                  lineClamp: 2,
                  overflow: 'hidden',
                  overflowWrap: 'anywhere',
                  flexShrink: 0,
                }}
              >
                {content.title}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 32,
                  lineHeight: 1.45,
                  lineClamp: 3,
                  overflow: 'hidden',
                  overflowWrap: 'anywhere',
                  color: '#989ca3',
                }}
              >
                {content.description}
              </p>
            </div>
          </div>,
          {
            width: OG_IMAGE_WIDTH,
            height: OG_IMAGE_HEIGHT,
            format: 'webp',
            lossless: true,
            fonts: googleFonts([{ name: fontFamily, weight: '400..700' }]),
            fontFamilies: [fontFamily],
            lang,
          },
        )
      },
    },
  },
})
