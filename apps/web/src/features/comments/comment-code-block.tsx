import type { BundledLanguage } from 'shiki'

import { useEffect, useState } from 'react'

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
  const [highlighted, setHighlighted] = useState<{
    code: string
    lang: string
    html: string
    style: React.CSSProperties
  }>()

  useEffect(() => {
    let cancelled = false

    async function highlight() {
      try {
        const [{ bundledLanguages, getSingletonHighlighter }, { createJavaScriptRegexEngine }] = await Promise.all([
          import('shiki'),
          import('shiki/engine/javascript'),
        ])
        const language = lang in bundledLanguages ? (lang as BundledLanguage) : 'plaintext'
        const highlighter = await getSingletonHighlighter({
          langs: [language],
          themes: ['vitesse-dark'],
          engine: createJavaScriptRegexEngine(),
        })
        const html = highlighter.codeToHtml(code, {
          lang: language,
          theme: 'vitesse-dark',
        })
        const theme = highlighter.getTheme('vitesse-dark')
        const codeHtml = /<code\b[^>]*>([\s\S]*?)<\/code>/.exec(html)?.[1]
        if (!cancelled && codeHtml)
          setHighlighted({
            code,
            lang,
            html: codeHtml,
            style: { color: theme.fg },
          })
      } catch (error) {
        console.error('Failed to highlight code:', error)
      }
    }

    void highlight()
    return () => {
      cancelled = true
    }
  }, [code, lang])

  return (
    <CodeBlock
      data-lang={lang}
      title={title}
      className='shiki max-h-120'
      style={highlighted?.style}
      figureClassName='my-6 mb-9'
    >
      {/* Shiki escapes user content before generating highlighted HTML. */}
      {highlighted?.code === code && highlighted.lang === lang ? (
        // oxlint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml
        <code dangerouslySetInnerHTML={{ __html: highlighted.html }} />
      ) : (
        <code>{code}</code>
      )}
    </CodeBlock>
  )
}
