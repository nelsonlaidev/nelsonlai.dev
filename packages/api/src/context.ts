import type { createAuth, Session } from '@repo/auth'
import type { Database } from '@repo/db'

export type Context = {
  auth: ReturnType<typeof createAuth>
  session: Session | null
  db: Database
  headers: Headers
  posts: ReadonlyArray<{
    slug: string
    locale: string
    title: string
  }>
}
