import type { Context } from './context'

import { isIP } from 'node:net'

import { ORPCError, os } from '@orpc/server'
import { ratelimit } from '@repo/kv'

const o = os.$context<Context>()

const rateLimitMiddleware = o.middleware(async ({ path, context, next }) => {
  const clientIp = context.headers.get('cf-connecting-ip')?.trim() ?? ''
  const ip = isIP(clientIp) ? clientIp : '0.0.0.0'
  const { success } = await ratelimit.limit(`${path.join(':')}:${ip}`)

  if (!success) throw new ORPCError('TOO_MANY_REQUESTS')

  return next()
})

const authMiddleware = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError('UNAUTHORIZED')
  }

  return next({ context: { session: context.session } })
})

export const publicProcedure = o.use(rateLimitMiddleware)

export const protectedProcedure = publicProcedure.use(authMiddleware)
