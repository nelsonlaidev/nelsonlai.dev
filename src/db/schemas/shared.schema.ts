import { timestamp } from 'drizzle-orm/pg-core'

export const timestamptz = (name: string) => timestamp(name, { withTimezone: true, mode: 'date' })

export const createdAt = () => timestamptz('created_at').notNull().defaultNow()

export const updatedAt = () =>
  timestamptz('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date())
