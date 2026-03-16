export function getMaskedEmail(email: string) {
  const [username, domain] = email.split('@')

  if (!username || !domain) return email

  const domainParts = domain.split('.')
  const tld = domainParts.at(-1)
  const domainName = domainParts.slice(0, -1).join('.')

  const maskedUsername = `${username.slice(0, 2)}***`
  const maskedDomain = `${domainName.slice(0, 2)}***`

  return `${maskedUsername}@${maskedDomain}.${tld}`
}
