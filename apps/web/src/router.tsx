import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { NotFound } from '@/components/not-found'
import { RouteError } from '@/components/route-error'

import { createQueryClient } from './lib/query-client'
import { deLocalizeUrl, isExcludedByRouteStrategy, localizeUrl } from './paraglide/runtime'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const queryClient = createQueryClient()

  const router = createTanStackRouter({
    routeTree,
    defaultErrorComponent: RouteError,
    defaultNotFoundComponent: NotFound,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    context: { queryClient },
    rewrite: {
      input: ({ url }) => {
        const canonical = deLocalizeUrl(url)

        return isExcludedByRouteStrategy(canonical.href) ? url : canonical
      },
      output: ({ url }) => (isExcludedByRouteStrategy(url.href) ? url : localizeUrl(url)),
    },
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}
