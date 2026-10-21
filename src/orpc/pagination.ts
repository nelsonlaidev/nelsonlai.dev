import type { SQL } from 'drizzle-orm'
import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import type * as z from 'zod'
import type { InfiniteQueryCursorSchema } from './schemas/common.schema'

import { and, asc, desc, eq, gt, lt, or } from 'drizzle-orm'

type TimestampPaginationColumns = {
  createdAt: AnyPgColumn<{ columnType: 'PgTimestamp'; data: Date; notNull: true }>
  id: AnyPgColumn<{ data: string; notNull: true }>
}

type TimestampPaginationOptions = {
  cursor?: z.infer<typeof InfiniteQueryCursorSchema>
  sort?: 'newest' | 'oldest'
}

export function createTimestampPagination(
  { createdAt, id }: TimestampPaginationColumns,
  { cursor, sort = 'newest' }: TimestampPaginationOptions,
) {
  const compare = sort === 'newest' ? lt : gt
  const order = sort === 'newest' ? desc : asc
  let where: SQL | undefined

  if (cursor) {
    const cursorTimestamp = new Date(cursor.createdAt)
    where = or(compare(createdAt, cursorTimestamp), and(eq(createdAt, cursorTimestamp), compare(id, cursor.id)))
  }

  return {
    where,
    orderBy: [order(createdAt), order(id)],
  }
}
