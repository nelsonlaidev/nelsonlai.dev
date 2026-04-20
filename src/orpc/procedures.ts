import type { Context } from './context'

import { ORPCError } from '@orpc/client'
import { os } from '@orpc/server'

import { IS_PRODUCTION } from '@/constants/common'
import { ratelimit } from '@/lib/kv'
import { getIp } from '@/utils/get-ip'
import { sleep } from '@/utils/sleep'

const base = os.$context<Context>()

const delayMiddleware = base.middleware(async ({ context, next }) => {
  if (!IS_PRODUCTION) {
    await sleep(500)
  }

  return next({ context })
})

const rateLimitMiddleware = base.middleware(async ({ path, context, next }) => {
  const ip = getIp(context.headers)

  const identifier = `${path.join(':')}:${ip}`
  const { success } = await ratelimit.limit(identifier)

  if (!success) throw new ORPCError('TOO_MANY_REQUESTS')

  return next({ context })
})

const authMiddleware = base.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError('UNAUTHORIZED')
  }

  return next({
    context: {
      session: context.session,
    },
  })
})

const errorMiddleware = base.middleware(async ({ next }) => {
  try {
    return await next()
  } catch (error) {
    console.error(error)

    throw error
  }
})

export const publicProcedure = base.use(rateLimitMiddleware).use(delayMiddleware).use(errorMiddleware)
export const protectedProcedure = publicProcedure.use(authMiddleware)
export const adminProcedure = protectedProcedure.use(async ({ context, next }) => {
  if (context.session.user.role !== 'admin') {
    throw new ORPCError('FORBIDDEN')
  }

  return next({ context })
})
