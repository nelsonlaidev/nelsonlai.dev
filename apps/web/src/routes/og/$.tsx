import type { Locale } from '@/paraglide/runtime'

import geistUrl from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?inline'
import { createFileRoute } from '@tanstack/react-router'
import { allPosts, allProjects } from 'content-collections'
import { googleFonts } from 'takumi-js/helpers'
import { ImageResponse } from 'takumi-js/response'

import { findPage } from '@/features/pages/pages.server'
import { listPosts } from '@/features/posts/posts.server'
import { listProjects } from '@/features/projects/projects.server'
import { ShareCard } from '@/features/sharing/share-card'
import { surfacePoster } from '@/features/sharing/surface.server'
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/og'
import { getLocale } from '@/paraglide/runtime'

import nacreSvg from '../../../public/brand/seafold-nacre.svg?raw'

const geistFont = Buffer.from(geistUrl.slice(geistUrl.indexOf(',') + 1), 'base64')
const logo = `data:image/svg+xml;base64,${Buffer.from(nacreSvg).toString('base64')}`
let mainImage: ReturnType<typeof surfacePoster> | undefined

const PAGE_GROUPS: Record<
  string,
  {
    group: string
    index: number
  }
> = {
  blog: { group: 'Writing', index: 1 },
  projects: { group: 'Selected work', index: 2 },
  about: { group: 'Nelson Lai', index: 3 },
  uses: { group: 'Everyday tools', index: 4 },
  guestbook: { group: 'Say hello', index: 5 },
  dashboard: { group: 'At a glance', index: 6 },
  terms: { group: 'Legal', index: 7 },
  privacy: { group: 'Legal', index: 8 },
}

const FONT_FAMILY_BY_LOCALE: Record<Locale, string> = {
  en: 'Geist',
  'zh-TW': 'Noto Sans TC',
  'zh-CN': 'Noto Sans SC',
  ja: 'Noto Sans JP',
  'pt-BR': 'Geist',
  es: 'Geist',
}

export const Route = createFileRoute('/og/$')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const pathSegments = (params._splat ?? '').split('/')

        if (pathSegments.pop() !== 'image.webp') {
          return new Response('Image not found', { status: 404 })
        }

        const locale = getLocale()
        const contentPath = pathSegments.join('/')

        let content:
          | {
              title: string
              description: string
            }
          | null
          | undefined
        let group = PAGE_GROUPS[contentPath]?.group ?? 'Nelson Lai'
        let index = PAGE_GROUPS[contentPath]?.index ?? 0

        if (!contentPath) {
          // The approved Surface poster is identical in every locale. Only its
          // immutable bytes are shared; failed renders can retry on the next request.
          mainImage ??= surfacePoster(geistFont, logo)
          let bytes
          try {
            bytes = await mainImage
          } catch (error) {
            mainImage = undefined
            throw error
          }
          return new Response(new Uint8Array(bytes), {
            headers: { 'Content-Type': 'image/webp' },
          })
        } else if (contentPath.startsWith('blog/')) {
          content = allPosts.find((post) => post.locale === locale && post.slug === contentPath.slice('blog/'.length))
          group = 'Blog'
          index = 9 + listPosts(locale).findIndex((post) => post.slug === contentPath.slice('blog/'.length))
        } else if (contentPath.startsWith('projects/')) {
          content = allProjects.find(
            (project) => project.locale === locale && project.slug === contentPath.slice('projects/'.length),
          )
          group = 'Projects'
          index =
            13 + listProjects(locale).findIndex((project) => project.slug === contentPath.slice('projects/'.length))
        } else {
          content = findPage(contentPath, locale)
        }

        if (!content) {
          return new Response('Content not found', { status: 404 })
        }

        const fontFamily = FONT_FAMILY_BY_LOCALE[locale]
        const fontFamilies = fontFamily === 'Geist' ? ['Geist'] : ['Geist', fontFamily]

        return new ImageResponse(
          <ShareCard
            title={content.title}
            description={content.description}
            group={group}
            index={index}
            fontFamily={fontFamilies.join(', ')}
            logo={logo}
          />,
          {
            width: OG_IMAGE_WIDTH,
            height: OG_IMAGE_HEIGHT,
            format: 'webp',
            lossless: true,
            fonts: [
              geistFont,
              ...(fontFamily === 'Geist' ? [] : await googleFonts([{ name: fontFamily, weight: '400..500' }])),
            ],
            fontFamilies,
            lang: locale,
          },
        )
      },
    },
  },
})
