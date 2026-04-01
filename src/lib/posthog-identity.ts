import { routing } from '@/i18n/routing'

const POSTHOG_COOKIE_PATTERN = /ph_phc_.*?_posthog=([^;]+)/

function parsePostHogCookie(cookieValue: string) {
  try {
    return JSON.parse(decodeURIComponent(cookieValue)) as { distinct_id?: unknown }
  } catch {
    return null
  }
}

function getPostHogCookieValue(cookieHeader?: string | string[]) {
  if (!cookieHeader) return

  const cookieString = Array.isArray(cookieHeader) ? cookieHeader.join('; ') : cookieHeader
  const match = POSTHOG_COOKIE_PATTERN.exec(cookieString)

  return match?.[1]
}

export function getDistinctIdFromPostHogCookie(cookieHeader?: string | string[]) {
  const rawCookie = getPostHogCookieValue(cookieHeader)
  if (!rawCookie) return

  const parsed = parsePostHogCookie(rawCookie)
  if (!parsed) return

  return typeof parsed.distinct_id === 'string' && parsed.distinct_id.length > 0 ? parsed.distinct_id : undefined
}

function getAnonymousDistinctId(headers: Headers) {
  const forwardedDistinctId = headers.get('x-posthog-distinct-id')
  if (forwardedDistinctId) return forwardedDistinctId

  return 'anon_unknown'
}

export function resolvePostHogDistinctId(headers: Headers, userId?: string) {
  if (userId) return userId

  const cookieDistinctId = getDistinctIdFromPostHogCookie(headers.get('cookie') ?? undefined)
  if (cookieDistinctId) return cookieDistinctId

  return getAnonymousDistinctId(headers)
}

export function getRouteContextFromHeaders(headers: Headers) {
  const referer = headers.get('referer')
  if (!referer) return {}

  try {
    const { pathname } = new URL(referer)
    const maybeLocale = pathname
      .split('/')
      .find(
        (segment, index) =>
          index > 0 && segment.length > 0 && routing.locales.includes(segment as (typeof routing.locales)[number]),
      )

    return {
      pathname,
      locale: routing.locales.includes(maybeLocale as (typeof routing.locales)[number]) ? maybeLocale : undefined,
    }
  } catch {
    return {}
  }
}
