import type { Context } from '@repo/api/context'

import { auth } from './auth'
import { db } from './db'

export async function createORPCContext(request: Request): Promise<Context> {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  return { db, session, headers: request.headers }
}
