import { useEffect, useState } from 'react'
import { type BundledLanguage, bundledLanguages } from 'shiki'

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
  const lang = className?.replace('lang-', '') ?? 'plaintext'
  const [highlighter] = useHighlighter()
  const [highlightedHtml, setHighlightedHtml] = useState('')
  const [isHighlighted, setIsHighlighted] = useState(false)

  useEffect(() => {
    if (!highlighter) return

    const currHighlighter = highlighter

    async function generateHighlightedHtml() {
      const loadedLanguages = currHighlighter.getLoadedLanguages()
      const hasLoadedLanguage = loadedLanguages.includes(lang)
      const bundledLang = bundledLanguages[lang as BundledLanguage]

      if (!hasLoadedLanguage) {
        await currHighlighter.loadLanguage(bundledLang)
      }

      return currHighlighter.codeToHtml(code, {
        lang: lang in bundledLanguages ? lang : 'plaintext',
        themes: {
          light: 'github-light-default',
          dark: 'github-dark-default',
        },
        defaultColor: false,
      })
    }

    generateHighlightedHtml().then((newHtml) => {
      setHighlightedHtml(newHtml)
      setIsHighlighted(true)
    })
  }, [code, highlighter, lang])

  const codeHtml = /<code\b[^>]*>([\s\S]*?)<\/code>/.exec(highlightedHtml)?.[1]

  return (
    <CodeBlock data-lang={lang} title={title} className='shiki' figureClassName='my-2' scrollAreaClassName='max-h-120'>
      {isHighlighted && codeHtml ? (
        <code
          // eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- safe
          dangerouslySetInnerHTML={{ __html: codeHtml }}
        />
      ) : (
        <code>{code}</code>
      )}
    </CodeBlock>
  )
}

export default CommentCodeBlock
