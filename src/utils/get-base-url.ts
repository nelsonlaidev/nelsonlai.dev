import { ENV } from '@/env'

export function getBaseUrl() {
  if (ENV.NEXT_PUBLIC_VERCEL_ENV === 'preview') return `https://${ENV.NEXT_PUBLIC_VERCEL_BRANCH_URL}`

  return ENV.NEXT_PUBLIC_SITE_URL
}
