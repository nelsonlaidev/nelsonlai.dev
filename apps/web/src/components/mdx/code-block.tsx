import { Button } from '@repo/ui/components/button'
import { ScrollArea } from '@repo/ui/components/scroll-area'
import { toast } from '@repo/ui/components/toast'
import { cn } from 'cn'
import { CheckIcon, CopyIcon } from 'lucide-react'
import mergeRefs from 'merge-refs'
import { useEffect, useRef, useState } from 'react'

import { getIconByLanguage } from '@/lib/get-icon-by-language'
import { m } from '@/paraglide/messages'

type CodeBlockProps = React.ComponentProps<'pre'> & {
  'data-lang'?: string
  figureClassName?: string
  scrollAreaClassName?: string
}

export function CodeBlock(props: CodeBlockProps) {
  const { children, title, 'data-lang': lang, figureClassName, scrollAreaClassName, ref, ...rest } = props
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const Icon = getIconByLanguage(lang ?? '')
  const hasCaption = Boolean(title) || Boolean(lang)

  useEffect(() => {
    if (!copied) return

    const timeout = setTimeout(() => {
      setCopied(false)
    }, 2000)

    return () => {
      clearTimeout(timeout)
    }
  }, [copied])

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(preRef.current?.textContent ?? '')
      setCopied(true)
    } catch {
      toast.add({ type: 'error', title: m.error_copy_to_clipboard_error() })
    }
  }

  const copyButton = (
    <Button
      type='button'
      variant={hasCaption ? 'outline' : 'ghost'}
      size='icon-sm'
      className={cn(
        'group-hover/code-block:opacity-100 focus-visible:opacity-100 [@media(hover:hover)]:opacity-0',
        !hasCaption && 'absolute top-2 right-2 z-10',
      )}
      onClick={() => {
        void copyCode()
      }}
      aria-label={copied ? m.common_copied() : m.common_aria_labels_copy_code()}
    >
      {copied ? <CheckIcon aria-hidden='true' /> : <CopyIcon aria-hidden='true' />}
    </Button>
  )

  return (
    <figure
      className={cn(
        'not-prose group/code-block relative my-8 overflow-hidden rounded-xl border bg-card text-sm',
        figureClassName,
      )}
    >
      {hasCaption ? (
        <div className='flex flex-row items-center gap-3 border-b bg-transparent px-3 py-2 text-sm sm:px-5'>
          <Icon className='size-3.5 shrink-0 text-muted-foreground' aria-hidden='true' />
          <figcaption className='flex-1 truncate wrap-anywhere whitespace-normal text-muted-foreground'>
            {title ?? lang}
          </figcaption>
          {copyButton}
        </div>
      ) : (
        copyButton
      )}
      <ScrollArea className={scrollAreaClassName}>
        <pre ref={mergeRefs(preRef, ref)} data-lang={lang} {...rest}>
          {children}
        </pre>
      </ScrollArea>
    </figure>
  )
}
