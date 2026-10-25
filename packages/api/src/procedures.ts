import type { Context } from './context'

import { ORPCError, os } from '@orpc/server'

const o = os.$context<Context>()

const authMiddleware = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError('UNAUTHORIZED')
  }

  return next({ context: { session: context.session } })
})

export const publicProcedure = o

export const protectedProcedure = publicProcedure.use(authMiddleware)
