import { createId } from '@paralleldrive/cuid2'
import { eq, sql } from 'drizzle-orm'

import { db } from '@/db'
import { verifications } from '@/db/schemas'

import { expect, test } from '../fixtures/test'

test.describe('database timestamp precision', () => {
  test('stores every application timestamp column with millisecond precision', async () => {
    const columns = await db.execute<{ tableName: string; columnName: string; precision: number }>(sql`
      SELECT table_name AS "tableName", column_name AS "columnName", datetime_precision AS precision
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND data_type IN ('timestamp with time zone', 'timestamp without time zone')
      ORDER BY table_name, column_name
    `)

    expect(columns.length).toBeGreaterThan(0)
    for (const column of columns) {
      expect(column.precision, `${column.tableName}.${column.columnName}`).toBe(3)
    }
  })

  test('rounds SQL timestamp inputs to the same precision returned by JavaScript Date', async () => {
    const id = createId()

    try {
      const [verification] = await db
        .insert(verifications)
        .values({
          id,
          identifier: `timestamp-${id}`,
          value: 'Timestamp precision regression',
          createdAt: sql`'2040-01-01T00:00:00.123456Z'::timestamptz`,
          updatedAt: sql`'2040-01-01T00:00:00.123789Z'::timestamptz`,
          expiresAt: sql`'2040-01-01T00:00:00.999789Z'::timestamptz`,
        })
        .returning()

      expect(verification).toMatchObject({
        id,
        createdAt: new Date('2040-01-01T00:00:00.123Z'),
        updatedAt: new Date('2040-01-01T00:00:00.124Z'),
        expiresAt: new Date('2040-01-01T00:00:01.000Z'),
      })
    } finally {
      await db.delete(verifications).where(eq(verifications.id, id))
    }
  })
})
