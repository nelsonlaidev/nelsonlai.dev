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
  limit: number
  sort?: 'newest' | 'oldest'
}

type TimestampPaginationRow = {
  createdAt: Date
  id: string
}

export function createTimestampPagination(
  { createdAt, id }: TimestampPaginationColumns,
  { cursor, limit, sort = 'newest' }: TimestampPaginationOptions,
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
    limit: limit + 1,
    orderBy: [order(createdAt), order(id)],
    getPage<T extends TimestampPaginationRow>(rows: T[]) {
      const items = rows.slice(0, limit)
      const last = items.at(-1)

      return {
        items,
        nextCursor: rows.length > limit && last ? { createdAt: last.createdAt.toISOString(), id: last.id } : undefined,
      }
    },
  }
}
