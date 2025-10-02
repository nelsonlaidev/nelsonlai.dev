import { auth } from '@/lib/auth'

import { protectedProcedure } from '../root'
import { listSessionsSchema } from '../schemas/auth.schema'

export const listSessions = protectedProcedure.output(listSessionsSchema).handler(async ({ context }) => {
  const sessions = await auth.api.listSessions({
    headers: context.headers
  })

  const result = sessions.map((session) => ({
    ...session,
    // better-auth types say ipAddress and userAgent can be undefined,
    // but they are always defined in practice.
    // So we coerce them to be string | null here
    ipAddress: (session.ipAddress ?? '') || null,
    userAgent: (session.userAgent ?? '') || null,
    isCurrentSession: session.id === context.session.session.id
  }))

  return {
    sessions: result
  }
})
