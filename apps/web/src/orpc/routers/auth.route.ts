import { ORPCError } from '@orpc/client'
import { APIError } from 'better-auth'

import { auth } from '@/lib/auth'

import { protectedProcedure } from '../root'
import { listSessionsOutputSchema, revokeSessionInputSchema } from '../schemas/auth.schema'
import { emptyOutputSchema } from '../schemas/common.schema'

export const listSessions = protectedProcedure.output(listSessionsOutputSchema).handler(async ({ context }) => {
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

export const revokeSession = protectedProcedure
  .input(revokeSessionInputSchema)
  .output(emptyOutputSchema)
  .handler(async ({ input, context }) => {
    try {
      await auth.api.revokeSession({
        headers: context.headers,
        body: { token: input.token }
      })
    } catch (error) {
      if (error instanceof APIError) {
        if (error.status === 'UNAUTHORIZED') throw new ORPCError('UNAUTHORIZED')
        if (error.status === 'BAD_REQUEST') throw new ORPCError('BAD_REQUEST')
      }

      throw new ORPCError('INTERNAL_SERVER_ERROR')
    }
  })
