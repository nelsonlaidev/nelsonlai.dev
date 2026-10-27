import { createHmac } from 'node:crypto'
import { isIP } from 'node:net'

import { ENV } from '../env'

export function getAnonymousKey(headers: Headers) {
  const forwardedIp = headers.get('cf-connecting-ip')?.trim() ?? ''
  const ip = isIP(forwardedIp) ? forwardedIp : '0.0.0.0'

  return createHmac('sha256', ENV.IP_ADDRESS_SALT).update(ip).digest().subarray(0, 16).toString('base64url')
}
