export const getIp = (headers: Headers) => {
  const forwardedFor = headers.get('x-forwarded-for')

  if (forwardedFor) {
    const ip = forwardedFor
      .split(',')
      .map((entry) => entry.trim())
      .find(Boolean)

    if (ip) {
      return ip
    }
  }

  const realIp = headers.get('x-real-ip')

  if (realIp) {
    return realIp
  }

  return '0.0.0.0'
}
