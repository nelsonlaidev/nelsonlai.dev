import { createHmac } from 'node:crypto'

import { env } from '@/lib/env'

export function getAnonKey(ip: string): string {
  const raw = createHmac('sha256', env.IP_ADDRESS_SALT).update(ip).digest().subarray(0, 16)
  return Buffer.from(raw).toString('base64url')
}
