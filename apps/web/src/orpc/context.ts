import type { NextRequest } from 'next/server'

import { db } from '@repo/db'
import { headers } from 'next/headers'

import { getSession } from '@/lib/auth'

export async function createORPCContext(request?: NextRequest) {
  const session = await getSession(request)

  return {
    session,
    db,
    headers: request?.headers ?? (await headers())
  }
}

export type Context = Awaited<ReturnType<typeof createORPCContext>>
