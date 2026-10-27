import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders, setResponseHeader } from '@tanstack/react-start/server'

import { auth } from '@/lib/auth'

export const getAccountUser = createServerFn({ method: 'GET' }).handler(async () => {
  setResponseHeader('Cache-Control', 'private, no-store')

  const headers = getRequestHeaders()
  const session = await auth.api.getSession({ headers })

  return session?.user ?? null
})
