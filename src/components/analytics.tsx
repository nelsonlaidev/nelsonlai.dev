import Script from 'next/script'
import { ENV } from 'varlock/env'

import { IS_PRODUCTION } from '@/constants/common'

export function Analytics() {
  if (!IS_PRODUCTION || !ENV.NEXT_PUBLIC_UMAMI_URL || !ENV.NEXT_PUBLIC_UMAMI_WEBSITE_ID) return null

  return (
    <Script async data-website-id={ENV.NEXT_PUBLIC_UMAMI_WEBSITE_ID} src={`${ENV.NEXT_PUBLIC_UMAMI_URL}/script.js`} />
  )
}
