import { env } from '@/lib/env'

export function getBaseUrl() {
  if (env.NEXT_PUBLIC_VERCEL_ENV === 'preview') return `https://${env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`

  return env.NEXT_PUBLIC_SITE_URL
}
