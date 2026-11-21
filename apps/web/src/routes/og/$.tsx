import type { Page } from 'content-collections'
import type { Locale } from '@/paraglide/runtime'

import { Logo } from '@repo/ui/components/logo'
import { createFileRoute } from '@tanstack/react-router'
import { googleFonts } from 'takumi-js/helpers'
import { ImageResponse } from 'takumi-js/response'

import { findPage } from '@/features/pages/pages.server'
import { findPost } from '@/features/posts/posts.server'
import { findProject } from '@/features/projects/projects.server'
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/og'
import { getLocale } from '@/paraglide/runtime'

import oceanSwellUrl from './-assets/ocean-swell.webp?inline'
import seafoldSurfaceUrl from './-assets/seafold-surface.webp?inline'

const homeImage = Buffer.from(seafoldSurfaceUrl.slice(seafoldSurfaceUrl.indexOf(',') + 1), 'base64')

const FALLBACK_FONT_BY_LOCALE: Record<Locale, string | null> = {
  en: null,
  'zh-TW': 'Noto Sans TC',
  'zh-CN': 'Noto Sans SC',
  ja: 'Noto Sans JP',
  'pt-BR': null,
  es: null,
}

export const Route = createFileRoute('/og/$')({
  server: {
    handlers: {
      GET: ({ params }) => {
        const pathSegments = (params._splat ?? '').split('/')
        if (pathSegments.pop() !== 'image.webp') {
          return new Response('Image not found', { status: 404 })
        }

        const contentPath = pathSegments.join('/')
        if (!contentPath) {
          return new Response(homeImage, { headers: { 'Content-Type': 'image/webp' } })
        }

        const locale = getLocale()
        const content = findShareContent(contentPath, locale)
        if (!content) {
          return new Response('Content not found', { status: 404 })
        }

        const { title, description } = content
        const fallbackFont = FALLBACK_FONT_BY_LOCALE[locale]
        const fontFamilies = fallbackFont ? ['Geist', fallbackFont] : ['Geist']

        return new ImageResponse(
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: fontFamilies.join(', '),
              backgroundColor: '#0c1420',
              backgroundImage: `url(${oceanSwellUrl})`,
              backgroundSize: 'cover',
            }}
          >
            <Logo width={76} height={76} color='#e7eee5' style={{ position: 'absolute', right: 60, top: 44 }} />
            <div
              style={{
                position: 'absolute',
                left: 72,
                right: 72,
                top: 96,
                bottom: 96,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontSize: getTitleFontSize(title),
                  fontWeight: 500,
                  lineHeight: 1.08,
                  letterSpacing: '-0.035em',
                  color: '#f4f6f8',
                  textWrap: 'balance',
                  lineClamp: 2,
                  overflow: 'hidden',
                  overflowWrap: 'anywhere',
                }}
              >
                {title}
              </div>
              <div
                style={{
                  marginTop: 24,
                  maxWidth: 1000,
                  fontSize: 32,
                  lineHeight: 1.42,
                  color: '#b4bfcd',
                  lineClamp: 4,
                  overflow: 'hidden',
                  overflowWrap: 'anywhere',
                }}
              >
                {description}
              </div>
            </div>
          </div>,
          {
            width: OG_IMAGE_WIDTH,
            height: OG_IMAGE_HEIGHT,
            format: 'webp',
            lossless: true,
            fonts: fallbackFont ? googleFonts([{ name: fallbackFont, weight: '400..500' }]) : undefined,
            fontFamilies,
            lang: locale,
          },
        )
      },
    },
  },
})

function findShareContent(path: string, locale: Locale): Pick<Page, 'title' | 'description'> | null {
  if (path.startsWith('blog/')) return findPost(path.slice('blog/'.length), locale)
  if (path.startsWith('projects/')) return findProject(path.slice('projects/'.length), locale)
  return findPage(path, locale)
}

function getTitleFontSize(title: string) {
  if (title.length > 80) return 48
  if (title.length > 34) return 64
  if (title.length > 24) return 72
  return 88
}
