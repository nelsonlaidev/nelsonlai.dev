import { createHmac } from 'node:crypto'

import { ENV } from '@/env'

export function getAnonKey(ip: string): string {
  const raw = createHmac('sha256', ENV.IP_ADDRESS_SALT).update(ip).digest().subarray(0, 16)
  return Buffer.from(raw).toString('base64url')
}
