const REDACTED_KEYS = new Set([
  'body',
  'comment',
  'commentBody',
  'content',
  'errorMessage',
  'guestbookMessage',
  'ip',
  'ipAddress',
  'location',
  'message',
  'rawBody',
  'responseBody',
])

function sanitizeString(value: string) {
  return value.slice(0, 160)
}

function sanitizeArray(value: unknown[]) {
  return value.slice(0, 10).map((item) => sanitizeValue(item))
}

function sanitizeRecord(value: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, nestedValue]) => {
      if (REDACTED_KEYS.has(key)) return []

      const sanitized = sanitizeValue(nestedValue)
      return sanitized === undefined ? [] : [[key, sanitized]]
    }),
  )
}

export function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value
  if (typeof value === 'boolean' || typeof value === 'number') return value
  if (typeof value === 'string') return sanitizeString(value)
  if (Array.isArray(value)) return sanitizeArray(value)
  if (value instanceof Date) return value.toISOString()
  if (value instanceof Error) return value.name
  if (typeof value === 'object') return sanitizeRecord(value as Record<string, unknown>)

  return undefined
}

export function sanitizeProperties(properties: Record<string, unknown> = {}) {
  return sanitizeRecord(properties)
}

export function getErrorKind(error: unknown) {
  if (error instanceof Error) {
    return error.name || 'Error'
  }

  if (typeof error === 'string') {
    return 'StringError'
  }

  if (error && typeof error === 'object' && 'name' in error) {
    return String(error.name)
  }

  return 'UnknownError'
}
