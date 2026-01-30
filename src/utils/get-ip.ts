import { ipAddress } from '@vercel/functions'

export function getIp(headers: Headers) {
  const ip = ipAddress(headers)
  if (ip) return ip

  return '0.0.0.0'
}
