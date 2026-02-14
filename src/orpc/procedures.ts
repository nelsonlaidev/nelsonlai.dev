import type { Context } from './context'

import { ORPCError } from '@orpc/client'
import { os } from '@orpc/server'
import * as z from 'zod'

import { IS_PRODUCTION } from '@/lib/constants'
import { TraceableError } from '@/lib/errors'
import { ratelimit } from '@/lib/kv'
import { getPostHogServer } from '@/lib/posthog'
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

const errorMiddleware = base.middleware(async ({ path, context, next }) => {
  try {
    return await next()
  } catch (error) {
    const posthog = getPostHogServer()

    let metadata: Record<string, unknown> = { path: path.join(':') }

    if (error instanceof TraceableError) {
      metadata = { ...metadata, ...error.context }
    } else if (error instanceof z.ZodError) {
      metadata.validationIssues = z.flattenError(error)
    }

    console.error(error)
    posthog.captureException(error, context.session?.user.id, metadata)
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
