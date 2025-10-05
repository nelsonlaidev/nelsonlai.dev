import type { roleEnum } from '@repo/db'

import { ORPCError } from '@orpc/client'
import { APIError } from 'better-auth'

import { auth } from '@/lib/auth'
import { getLocation } from '@/utils/get-location'

import { protectedProcedure, publicProcedure } from '../root'
import {
  getSessionOutputSchema,
  listSessionsOutputSchema,
  revokeSessionInputSchema,
  updateUserInputSchema
} from '../schemas/auth.schema'
import { emptyOutputSchema } from '../schemas/common.schema'

export const getSession = publicProcedure.output(getSessionOutputSchema).handler(async ({ context }) => {
  const session = await auth.api.getSession({
    headers: context.headers
  })

  if (!session) return null

  // See https://github.com/better-auth/better-auth/issues/443
  // type mismatch between better-auth and drizzle
  const result = {
    session: {
      ...session.session,
      ipAddress: (session.session.ipAddress ?? '') || null,
      userAgent: (session.session.userAgent ?? '') || null
    },
    user: {
      ...session.user,
      image: (session.user.image ?? '') || null,
      role: session.user.role as (typeof roleEnum.enumValues)[number]
    }
  }

  return result
})

export const listSessions = protectedProcedure.output(listSessionsOutputSchema).handler(async ({ context }) => {
  const sessions = await auth.api.listSessions({
    headers: context.headers
  })

  const result = await Promise.all(
    sessions.map(async (session) => ({
      ...session,
      // See https://github.com/better-auth/better-auth/issues/443
      // type mismatch between better-auth and drizzle
      ipAddress: (session.ipAddress ?? '') || null,
      userAgent: (session.userAgent ?? '') || null,
      isCurrentSession: session.id === context.session.session.id,
      location: session.ipAddress ? await getLocation(session.ipAddress) : null
    }))
  )

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

export const updateUser = protectedProcedure
  .input(updateUserInputSchema)
  .output(emptyOutputSchema)
  .handler(async ({ input, context }) => {
    await auth.api.updateUser({
      headers: context.headers,
      body: {
        name: input.name
      }
    })
  })
