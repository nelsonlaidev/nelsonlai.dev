import { createHmac } from 'node:crypto'

import { env } from '@repo/env'

export const getAnonKey = (ip: string): string => {
  const raw = createHmac('sha256', env.IP_ADDRESS_SALT).update(ip).digest().subarray(0, 16)
  return Buffer.from(raw).toString('base64url')
}
