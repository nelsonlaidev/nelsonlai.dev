export function getMaskedEmail(email: string) {
  const [username, domain] = email.split('@')

  if (!username || !domain) return email

  const firstChar = username[0]
  const lastChar = domain.at(-1)

  return `${firstChar}***@***${lastChar}`
}
