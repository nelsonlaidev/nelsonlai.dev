import Script from 'next/script'

import { IS_PRODUCTION } from '@/constants/common'
import { ENV } from '@/env'

export function Analytics() {
  if (!IS_PRODUCTION || !ENV.NEXT_PUBLIC_UMAMI_URL || !ENV.NEXT_PUBLIC_UMAMI_WEBSITE_ID) return null

  return (
    <Script async data-website-id={ENV.NEXT_PUBLIC_UMAMI_WEBSITE_ID} src={`${ENV.NEXT_PUBLIC_UMAMI_URL}/script.js`} />
  )
}
