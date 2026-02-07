type DeepObject = {
  [key: string]: string | DeepObject
}

function isDeepObject(value: unknown): value is DeepObject {
  return typeof value === 'object' && value !== null
}

export async function loadMessages(locale: string): Promise<DeepObject> {
  const mod = await import(`./messages/${locale}.json`)

  if (typeof mod === 'object' && mod !== null && 'default' in mod && isDeepObject(mod.default)) {
    return mod.default
  }

  throw new Error(`Invalid messages format for locale: ${locale}`)
}

export function flattenKeys(object: DeepObject, prefix = ''): string[] {
  const keys: string[] = []

  for (const [key, value] of Object.entries(object)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      keys.push(fullKey)
    } else {
      keys.push(...flattenKeys(value, fullKey))
    }
  }

  return keys
}
