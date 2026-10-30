/** Read navigation metadata from the same MDX sections that render the inventory. */
export function usesInventory(content: string) {
  return [
    ...content.matchAll(/<UsesSection\s+kind=['"]([^'"]+)['"]\s+title=['"]([^'"]+)['"]>([\s\S]*?)<\/UsesSection>/g),
  ].map((match) => ({
    id: match[1] ?? '',
    title: match[2] ?? '',
    count: match[1] === 'laptop' ? 1 : [...(match[3] ?? '').matchAll(/image:/g)].length,
  }))
}
