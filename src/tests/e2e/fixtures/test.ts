import { randomBytes } from 'node:crypto'

import { test as base } from '@playwright/test'

export const test = base.extend({
  extraHTTPHeaders: async ({ extraHTTPHeaders }, provide) => {
    // Better Auth groups IPv6 clients by /64, so vary the documentation-only subnet for each test.
    const address = randomBytes(4)
    const ip = `2001:db8:${address.readUInt16BE(0).toString(16)}:${address.readUInt16BE(2).toString(16)}::1`

    await provide({
      ...extraHTTPHeaders,
      'x-real-ip': ip,
      'x-forwarded-for': ip,
    })
  },
})

export { expect } from '@playwright/test'
