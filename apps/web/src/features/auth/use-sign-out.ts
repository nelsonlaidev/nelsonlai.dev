import { authClient } from '@repo/auth/client'
import { toast } from '@repo/ui/components/toast'
import { useRef, useState } from 'react'

import { m } from '@/paraglide/messages'

export function useSignOut(options: { reason?: 'sign-out' | 'session-revoked' } = {}) {
  const isSessionRevocation = options.reason === 'session-revoked'
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pendingRef = useRef(false)

  async function signOut() {
    if (pendingRef.current) return false

    pendingRef.current = true

    setIsSigningOut(true)

    try {
      const { error } = await authClient.signOut()

      if (error) {
        toast.add({ type: 'error', title: isSessionRevocation ? m.error_something_went_wrong() : error.message })
        return false
      }

      toast.add({
        type: 'success',
        title: isSessionRevocation ? m.success_session_revoked() : m.success_signed_out(),
      })
      globalThis.location.reload()
      return true
    } catch {
      toast.add({
        type: 'error',
        title: isSessionRevocation ? m.error_something_went_wrong() : m.error_sign_out_failed(),
      })
      return false
    } finally {
      pendingRef.current = false
      setIsSigningOut(false)
    }
  }

  return { isSigningOut, signOut }
}
