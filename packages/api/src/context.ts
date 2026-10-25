import type { Session } from '@repo/auth'
import type { Database } from '@repo/db'

export type Context = {
  session: Session | null
  db: Database
}
