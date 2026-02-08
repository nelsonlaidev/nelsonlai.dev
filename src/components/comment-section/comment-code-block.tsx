import { useEffect, useRef, useState } from 'react'
import { bundledLanguages } from 'shiki'
import type { BundledLanguage } from 'shiki'

import { CodeBlock } from '@/components/ui/code-block'
import { useHighlighter } from '@/hooks/use-highlighter'

type CommentCodeBlockProps = {
  children: {
    props: {
      children: string
      className?: string
      title?: string
    }
  }
}

function CommentCodeBlock(props: CommentCodeBlockProps) {
  const {
    children: {
      props: { children: code, className, title },
    },
  } = props
  const lang =
    className
      ?.split(' ')
      .find((c) => c.startsWith('lang-') || c.startsWith('language-'))
      ?.replace(/^(lang-|language-)/, '') ?? 'plaintext'
  const { highlighter, initHighlighter } = useHighlighter()
  const [highlightedHtml, setHighlightedHtml] = useState('')
  const [isHighlighted, setIsHighlighted] = useState(false)
  const initCalled = useRef(false)

  useEffect(() => {
    if (!initCalled.current) {
      initCalled.current = true
      void initHighlighter()
    }
  }, [initHighlighter])

  useEffect(() => {
    if (!highlighter) return

    const currHighlighter = highlighter

    async function generateHighlightedHtml() {
      try {
        const loadedLanguages = currHighlighter.getLoadedLanguages()
        const hasLoadedLanguage = loadedLanguages.includes(lang)
        const bundledLang = bundledLanguages[lang as BundledLanguage]

        if (!hasLoadedLanguage && bundledLang) {
          await currHighlighter.loadLanguage(bundledLang)
        }

        const newHtml = currHighlighter.codeToHtml(code, {
          lang: lang in bundledLanguages ? lang : 'plaintext',
          themes: {
            light: 'github-light-default',
            dark: 'github-dark-default',
          },
          defaultColor: false,
        })

        setHighlightedHtml(newHtml)
        setIsHighlighted(true)
      } catch (error) {
        console.error('Failed to highlight code:', error)
        setIsHighlighted(false)
      }
    }

    void generateHighlightedHtml()
  }, [code, highlighter, lang])

  const codeHtml = /<code\b[^>]*>([\s\S]*?)<\/code>/.exec(highlightedHtml)?.[1]

  return (
    <CodeBlock data-lang={lang} title={title} className='shiki' figureClassName='my-2' scrollAreaClassName='max-h-120'>
      {/* HTML of highlighted code is safely generated. */}
      {/* oxlint-disable-next-line react/no-danger */}
      {isHighlighted && codeHtml ? <code dangerouslySetInnerHTML={{ __html: codeHtml }} /> : <code>{code}</code>}
    </CodeBlock>
  )
}

export default CommentCodeBlock
