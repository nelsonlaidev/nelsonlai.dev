'use client'

import { useLocale } from 'next-intl'
import { useEffect, useRef } from 'react'

import { usePathname } from '@/i18n/routing'
import { useSession } from '@/lib/auth-client'
import { resetPostHogUser, syncPostHogUser } from '@/lib/posthog-client'

export function PostHogUserSync() {
  const { data: session } = useSession()
  const locale = useLocale()
  const pathname = usePathname()
  const previousUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    const user = session?.user

    if (user) {
      syncPostHogUser(
        {
          id: user.id,
          role: user.role,
        },
        { locale, pathname },
      )
      previousUserIdRef.current = user.id
      return
    }

    if (previousUserIdRef.current) {
      resetPostHogUser({ locale, pathname })
      previousUserIdRef.current = null
      return
    }

    syncPostHogUser(null, { locale, pathname })
  }, [locale, pathname, session?.user])

  return null
}
