'use client'

import type { EventProperties, POSTHOG_EVENTS, PostHogEventName } from '@/lib/posthog-events'

import posthog from 'posthog-js'

import { env } from '@/env'
import { POSTHOG_EVENT_VERSION } from '@/lib/posthog-events'
import { getErrorKind, sanitizeProperties } from '@/lib/posthog-sanitize'

function getBaseProperties(pathname?: string, locale?: string, userRole?: string) {
  return {
    event_version: POSTHOG_EVENT_VERSION,
    event_source: 'frontend' as const,
    is_authenticated: Boolean(userRole),
    pathname,
    locale,
    user_role: userRole,
  }
}

function isPostHogClientEnabled() {
  return Boolean(env.NEXT_PUBLIC_POSTHOG_KEY && env.NEXT_PUBLIC_POSTHOG_HOST)
}

export function captureClientEvent<
  TEvent extends Extract<
    PostHogEventName,
    | typeof POSTHOG_EVENTS.authSignInStarted
    | typeof POSTHOG_EVENTS.authSignInFailed
    | typeof POSTHOG_EVENTS.authSignOutSucceeded
    | typeof POSTHOG_EVENTS.uiSignInDialogOpened
  >,
>(
  event: TEvent,
  properties: EventProperties<TEvent>,
  context: { pathname?: string; locale?: string; userRole?: string } = {},
) {
  if (!isPostHogClientEnabled()) return

  posthog.capture(event, {
    ...getBaseProperties(context.pathname, context.locale, context.userRole),
    ...sanitizeProperties(properties as Record<string, unknown>),
  })
}

export function captureClientException(
  error: unknown,
  context: {
    pathname?: string
    locale?: string
    userRole?: string
    additionalProperties?: Record<string, unknown>
  } = {},
) {
  if (!isPostHogClientEnabled()) return

  posthog.captureException(error, {
    ...getBaseProperties(context.pathname, context.locale, context.userRole),
    error_kind: getErrorKind(error),
    ...sanitizeProperties(context.additionalProperties),
  })
}

export function syncPostHogUser(
  user: { id: string; role: string } | null,
  context: { pathname?: string; locale?: string },
) {
  if (!isPostHogClientEnabled()) return

  posthog.register({
    pathname: context.pathname,
    locale: context.locale,
    is_authenticated: Boolean(user),
    user_role: user?.role,
  })

  if (user) {
    posthog.identify(user.id, {
      locale: context.locale,
      role: user.role,
    })
  }
}

export function resetPostHogUser(context: { pathname?: string; locale?: string }) {
  if (!isPostHogClientEnabled()) return

  posthog.reset()
  posthog.register({
    pathname: context.pathname,
    locale: context.locale,
    is_authenticated: false,
  })
}
