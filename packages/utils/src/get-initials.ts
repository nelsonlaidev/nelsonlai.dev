export const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/u, 2)
    .map((part) => graphemeSegmenter.segment(part).containing(0)?.segment)
    .join('')
}
