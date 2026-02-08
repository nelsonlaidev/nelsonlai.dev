import type { HighlighterCore } from 'shiki'

import { atom, useAtom } from 'jotai'

const instanceAtom = atom<HighlighterCore | null>(null)

let initPromise: Promise<void> | null = null

const highlighterAtom = atom(
  (get) => get(instanceAtom),
  async (get, set) => {
    if (get(instanceAtom)) return

    if (initPromise) {
      await initPromise
      return
    }

    initPromise = (async () => {
      const { createHighlighter } = await import('shiki')
      const { createJavaScriptRegexEngine } = await import('shiki/engine/javascript')

      const instance = await createHighlighter({
        langs: [],
        themes: ['github-light-default', 'github-dark-default'],
        engine: createJavaScriptRegexEngine(),
      })

      set(instanceAtom, instance)
    })()

    try {
      await initPromise
    } finally {
      initPromise = null
    }
  },
)

export function useHighlighter() {
  const [highlighter, initHighlighter] = useAtom(highlighterAtom)

  return { highlighter, initHighlighter }
}
