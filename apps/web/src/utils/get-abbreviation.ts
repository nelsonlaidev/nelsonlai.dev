export const getAbbreviation = (name: string) => {
  const abbreviation = name
    .split(' ')
    .map((n) => n[0])
    .join('')

  if (abbreviation.length > 2) {
    return abbreviation.slice(0, 2)
  }

  return abbreviation
}
