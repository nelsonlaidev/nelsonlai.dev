import { execFileSync } from 'node:child_process'

import { describe, expect, test } from 'vitest'

describe('trend bucket calendar dates', () => {
  test.each(['America/Los_Angeles', 'America/New_York', 'Asia/Hong_Kong', 'UTC'])(
    'preserves tick and tooltip calendar days in %s',
    (timezone) => {
      const result = execFileSync(
        process.execPath,
        [
          '--import',
          'tsx',
          '--input-type=module',
          '--eval',
          `
          import { formatTrendDate } from './src/features/admin/trend-date.ts'
          const dates = ['2026-10-30', '2026-03-08', '2026-11-01', '2024-02-29', '2026-01-01']
          console.log(JSON.stringify(dates.map(day => [
            formatTrendDate(day, 'en', { month: 'short', day: 'numeric' }),
            formatTrendDate(day, 'en', { month: 'long', day: 'numeric', year: 'numeric' }),
            formatTrendDate(day, 'zh-TW', { month: 'long', day: 'numeric', year: 'numeric' }),
          ])))
        `,
        ],
        { env: { ...process.env, TZ: timezone }, encoding: 'utf-8' },
      )
      expect(JSON.parse(result)).toEqual([
        ['Oct 30', 'October 30, 2026', '2026年10月30日'],
        ['Mar 8', 'March 8, 2026', '2026年3月8日'],
        ['Nov 1', 'November 1, 2026', '2026年11月1日'],
        ['Feb 29', 'February 29, 2024', '2024年2月29日'],
        ['Jan 1', 'January 1, 2026', '2026年1月1日'],
      ])
    },
  )
})
