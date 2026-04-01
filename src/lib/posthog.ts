import type { AnalyticsSource, BaseEventProperties, EventProperties, PostHogEventName } from './posthog-events'

import { PostHog } from 'posthog-node'

import { env } from '../env'
import { getPostHogHost } from './posthog-config'
import { POSTHOG_EVENT_VERSION } from './posthog-events'
import { getRouteContextFromHeaders, resolvePostHogDistinctId } from './posthog-identity'
import { getErrorKind, sanitizeProperties } from './posthog-sanitize'

let posthogInstance: PostHog | null = null

function getPostHogServerOrNull() {
  const host = getPostHogHost()

  if (!env.NEXT_PUBLIC_POSTHOG_KEY || !host) {
    return null
  }

  posthogInstance ??= new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
    host,
    flushAt: 1,
    flushInterval: 0,
  })

  return posthogInstance
}

function getBaseProperties(
  source: AnalyticsSource,
  headers?: Headers,
  userRole?: string,
  isAuthenticated = false,
): BaseEventProperties {
  const routeContext = headers ? getRouteContextFromHeaders(headers) : {}

  return {
    event_version: POSTHOG_EVENT_VERSION,
    event_source: source,
    is_authenticated: isAuthenticated,
    user_role: userRole,
    ...routeContext,
  }
}

type ServerCaptureContext = {
  headers: Headers
  userId?: string
  userRole?: string
}

export function captureServerEvent<TEvent extends PostHogEventName>(
  event: TEvent,
  properties: EventProperties<TEvent>,
  context: ServerCaptureContext,
) {
  const posthog = getPostHogServerOrNull()
  if (!posthog) return

  posthog.capture({
    distinctId: resolvePostHogDistinctId(context.headers, context.userId),
    event,
    properties: {
      ...getBaseProperties('backend', context.headers, context.userRole, Boolean(context.userId)),
      ...sanitizeProperties(properties),
    },
  })
}

export function captureServerException(
  error: unknown,
  context: ServerCaptureContext,
  additionalProperties: Record<string, unknown> = {},
) {
  const posthog = getPostHogServerOrNull()
  if (!posthog) return

  posthog.captureException(error, resolvePostHogDistinctId(context.headers, context.userId), {
    ...getBaseProperties('backend', context.headers, context.userRole, Boolean(context.userId)),
    error_kind: getErrorKind(error),
    ...sanitizeProperties(additionalProperties),
  })
}
