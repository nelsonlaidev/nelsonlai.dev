import type { Context } from '@repo/api/context'

import { allPosts } from 'content-collections'

import { auth } from './auth'
import { db } from './db'

export async function createORPCContext(request: Request): Promise<Context> {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  return { auth, db, session, headers: request.headers, posts: allPosts }
}
