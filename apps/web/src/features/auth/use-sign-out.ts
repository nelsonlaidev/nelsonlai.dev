import { toast } from '@repo/ui/components/toast'
import { useRef, useState } from 'react'

import { authClient } from '@/lib/auth-client'
import { m } from '@/paraglide/messages'

import { useSessionEnded } from './use-session-ended'

export function useSignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pendingRef = useRef(false)
  const reconcileSessionEnded = useSessionEnded()

  async function signOut() {
    if (pendingRef.current) return false

    pendingRef.current = true

    setIsSigningOut(true)

    try {
      const { error } = await authClient.signOut()

      if (error) {
        toast.add({ type: 'error', title: error.message })
        return false
      }

      try {
        await reconcileSessionEnded()
      } catch {
        // The sign-out succeeded even if refreshing the UI failed.
        toast.add({ type: 'error', title: m.error_something_went_wrong() })
        return true
      }

      toast.add({ type: 'success', title: m.success_signed_out() })
      return true
    } catch {
      toast.add({ type: 'error', title: m.error_sign_out_failed() })
      return false
    } finally {
      pendingRef.current = false
      setIsSigningOut(false)
    }
  }

  return { isSigningOut, signOut }
}
