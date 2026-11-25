import type { BundledLanguage } from 'shiki'

import { Fragment, useEffect, useState } from 'react'
import { bundledLanguagesInfo } from 'shiki/langs'

import { CodeBlock } from '@/components/mdx/code-block'

type CommentCodeBlockProps = {
  children: React.ReactElement<{
    children: string
    className?: string
    title?: string
  }>
}

export function CommentCodeBlock(props: CommentCodeBlockProps) {
  const {
    children: {
      props: { children: code, className, title },
    },
  } = props
  const lang =
    className
      ?.split(' ')
      .find((name) => /^(?:lang-|language-)/.test(name))
      ?.replace(/^(?:lang-|language-)/, '') ?? 'plaintext'
  const languageInfo = bundledLanguagesInfo.find((info) => info.id === lang || info.aliases?.includes(lang))
  const [highlighted, setHighlighted] = useState<{
    code: string
    lang: string
    lines: React.ReactNode[]
    style: React.CSSProperties
  }>()

  useEffect(() => {
    let cancelled = false

    async function highlight() {
      try {
        const [{ getSingletonHighlighter, getTokenStyleObject }, { createJavaScriptRegexEngine }] = await Promise.all([
          import('shiki'),
          import('shiki/engine/javascript'),
        ])
        const language = languageInfo ? (lang as BundledLanguage) : 'plaintext'
        const highlighter = await getSingletonHighlighter({
          langs: [language],
          themes: ['vitesse-dark'],
          engine: createJavaScriptRegexEngine(),
        })
        const { tokens, fg } = highlighter.codeToTokens(code, {
          lang: language,
          theme: 'vitesse-dark',
        })
        if (cancelled) return

        let lineOffset = 0
        const lines = tokens.map((line, lineIndex) => {
          const offset = lineOffset
          lineOffset += line.reduce((length, token) => length + token.content.length, 0) + 1

          return (
            <Fragment key={offset}>
              {lineIndex > 0 ? '\n' : null}
              <span>
                {line.map((token) => {
                  const style = getTokenStyleObject(token)

                  return (
                    <span
                      key={token.offset}
                      style={{
                        color: style.color,
                        backgroundColor: style['background-color'],
                        fontStyle: style['font-style'],
                        fontWeight: style['font-weight'],
                        textDecoration: style['text-decoration'],
                      }}
                    >
                      {token.content}
                    </span>
                  )
                })}
              </span>
            </Fragment>
          )
        })

        setHighlighted({ code, lang, lines, style: { color: fg } })
      } catch (error) {
        console.error('Failed to highlight code:', error)
      }
    }

    void highlight()

    return () => {
      cancelled = true
    }
  }, [code, lang, languageInfo])

  return (
    <CodeBlock
      data-lang={lang}
      title={title ?? languageInfo?.name}
      className='shiki'
      scrollAreaClassName='[&>[data-slot=scroll-area-viewport]]:max-h-120'
      style={highlighted?.style}
      figureClassName='mt-6 mb-9'
    >
      {highlighted?.code === code && highlighted.lang === lang ? <code>{highlighted.lines}</code> : <code>{code}</code>}
    </CodeBlock>
  )
}
