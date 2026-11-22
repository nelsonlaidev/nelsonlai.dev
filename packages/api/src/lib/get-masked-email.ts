import * as z from 'zod'

export function getMaskedEmail(email: string) {
  if (!z.regexes.email.test(email)) return '***'

  const atIndex = email.indexOf('@')
  const username = email.slice(0, atIndex)
  const domain = email.slice(atIndex + 1)

  return `${username.slice(0, 2)}***@${domain}`
}
