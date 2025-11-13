import type { HighlighterCore } from 'shiki'

import { atom, useAtom } from 'jotai'

const highlighterAtom = atom<HighlighterCore | null>(null)

export const useHighlighter = () => {
  return useAtom(highlighterAtom)
}
