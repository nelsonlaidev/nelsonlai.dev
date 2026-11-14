import '@fontsource-variable/geist/wght.css'
import '@fontsource-variable/geist-mono/wght.css'
import '@fontsource-variable/noto-sans-tc/wght.css'
import '@fontsource-variable/noto-sans-sc/wght.css'

import type { QueryClient } from '@tanstack/react-query'
import type { AnyRouteMatch } from '@tanstack/react-router'
import type { Formats } from 'use-intl'

import geistUrl from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'
import geistMonoUrl from '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url'
import { Toaster } from '@repo/ui/components/toast'
import { UIProvider } from '@repo/ui/components/ui-provider'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, HeadContent, Scripts, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { SkulletProvider } from 'skullet/react'
import { IntlProvider } from 'use-intl'

import { MainLayout } from '@/components/main-layout'
import { NavigationSpinner } from '@/components/navigation-spinner'
import { NotFound } from '@/components/not-found'
import { ENV } from '@/env'
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/og'
import { getLocalizedUrl, OPEN_GRAPH_LOCALES } from '@/lib/seo'
import { SITE } from '@/lib/site'

import { m } from '../paraglide/messages'
import { getLocale } from '../paraglide/runtime'
import appCss from '../styles/index.css?url'

type RouterContext = {
  queryClient: QueryClient
}

const twitterHandle = `@${new URL(SITE.socials.twitter).pathname.slice(1)}`

const INTL_FORMATS = {
  dateTime: {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { dateStyle: 'medium', timeStyle: 'short' },
  },
} satisfies Formats

export const Route = createRootRouteWithContext<RouterContext>()({
  headers: () => ({ 'Cache-Control': 'private, no-store' }),
  head: () => {
    const description = m.metadata_site_description()
    const fallbackImage = getLocalizedUrl('/og/image.webp', getLocale())

    const scripts: AnyRouteMatch['scripts'] = []

    if (ENV.UMAMI_URL && ENV.UMAMI_WEBSITE_ID) {
      const umamiScript = {
        src: `${ENV.UMAMI_URL}/script.js`,
        defer: true,
        'data-website-id': ENV.UMAMI_WEBSITE_ID,
      }

      scripts.push(umamiScript)
    }

    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title: SITE.name },
        { name: 'description', content: description },
        { name: 'author', content: SITE.name },
        { name: 'creator', content: SITE.name },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SITE.name },
        { property: 'og:locale', content: OPEN_GRAPH_LOCALES[getLocale()] },
        { property: 'og:title', content: SITE.name },
        { property: 'og:description', content: description },
        { property: 'og:image', content: fallbackImage },
        { property: 'og:image:type', content: 'image/webp' },
        { property: 'og:image:width', content: String(OG_IMAGE_WIDTH) },
        { property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) },
        { name: 'twitter:image', content: fallbackImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: twitterHandle },
        { name: 'twitter:site:id', content: SITE.twitterUserId },
        { name: 'twitter:creator', content: twitterHandle },
        { name: 'twitter:creator:id', content: SITE.twitterUserId },
        { name: 'twitter:title', content: SITE.name },
        { name: 'twitter:description', content: description },
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        { rel: 'author', href: ENV.SITE_URL },
        { rel: 'icon', href: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'manifest', href: '/site.webmanifest' },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: SITE.name,
          href: getLocalizedUrl('/rss.xml', getLocale()),
        },
        {
          rel: 'preload',
          href: geistUrl,
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: geistMonoUrl,
          as: 'font',
          type: 'font/woff2',
          crossOrigin: 'anonymous',
        },
      ],
      scripts,
    }
  },
  notFoundComponent: RootNotFound,
  shellComponent: RootDocument,
})

type RootDocumentProps = {
  children: React.ReactNode
}

function RootDocument(props: RootDocumentProps) {
  const { children } = props
  const pendingHref = useRouterState({
    select: (state) =>
      state.status === 'pending' && state.resolvedLocation && state.location.href !== state.resolvedLocation.href
        ? state.location.href
        : undefined,
  })

  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <SkulletProvider mode='dark'>
          <UIProvider
            translations={{
              loading: m.common_aria_labels_loading(),
              close: m.common_labels_close(),
              commandDialogTitle: m.command_menu_title(),
              commandDialogDescription: m.command_menu_description(),
              treeView: m.common_aria_labels_tree_view(),
              sidebarTitle: m.admin_sidebar_title(),
              sidebarDescription: m.admin_sidebar_description(),
              toggleSidebar: m.common_aria_labels_toggle_sidebar(),
            }}
          >
            <IntlProvider locale={getLocale()} formats={INTL_FORMATS}>
              {children}
              {pendingHref && <NavigationSpinner key={pendingHref} />}
              <Toaster timeout={2500} limit={5} />
            </IntlProvider>
          </UIProvider>
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              { name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> },
              { name: 'TanStack Query', render: <ReactQueryDevtoolsPanel /> },
            ]}
          />
          <Scripts />
        </SkulletProvider>
      </body>
    </html>
  )
}

function RootNotFound() {
  return (
    <MainLayout>
      <NotFound />
    </MainLayout>
  )
}
