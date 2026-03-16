export function getInitials(name: string) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')

  if (initials.length > 2) {
    return initials.slice(0, 2)
  }

  return initials
}
