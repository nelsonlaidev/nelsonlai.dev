import { toast } from '@repo/ui/components/toast'
import { useRef, useState } from 'react'

import { authClient } from '@/lib/auth-client'
import { m } from '@/paraglide/messages'

export function useSignOut() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const pendingRef = useRef(false)

  async function signOut() {
    if (pendingRef.current) return false

    pendingRef.current = true

    setIsSigningOut(true)

    try {
      const { error } = await authClient.signOut()

      if (error) {
        toast.add({ type: 'error', description: error.message })
        return false
      }

      toast.add({ type: 'success', description: m.success_signed_out() })
      return true
    } catch {
      toast.add({ type: 'error', description: m.error_sign_out_failed() })
      return false
    } finally {
      pendingRef.current = false
      setIsSigningOut(false)
    }
  }

  return { isSigningOut, signOut }
}
