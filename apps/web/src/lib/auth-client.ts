import type { auth } from './auth'

import { toast } from '@repo/ui/components/sonner'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error('Too many requests. Please try again later.')
      }
    }
  }
})

export const { useSession } = authClient

export type User = (typeof authClient.$Infer.Session)['user']
