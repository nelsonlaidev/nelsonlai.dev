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
  const { children, className, title, 'data-lang': lang, figureClassName, scrollAreaClassName, ref, ...rest } = props
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const Icon = getIconByLanguage(lang ?? '')

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
      variant='ghost'
      size='icon-sm'
      className={cn(
        'size-7.5 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100',
        title ? '-me-2' : 'absolute top-2 right-2 z-10',
      )}
      onClick={() => {
        void copyCode()
      }}
      aria-label={m.common_aria_labels_copy_code()}
    >
      {copied ? (
        <CheckIcon className='size-3.5' aria-hidden='true' />
      ) : (
        <CopyIcon className='size-3.5' aria-hidden='true' />
      )}
    </Button>
  )

  return (
    <figure
      className={cn(
        'not-prose group relative my-6 overflow-hidden rounded-2xl border bg-input/30 text-sm',
        figureClassName,
      )}
    >
      {title ? (
        <div className='flex flex-row items-center gap-2 border-b bg-muted px-4 py-1.5'>
          <div className='text-muted-foreground'>
            <Icon className='size-3.5' aria-hidden='true' />
          </div>
          <figcaption className='flex-1 truncate text-muted-foreground'>{title}</figcaption>
          {copyButton}
        </div>
      ) : (
        copyButton
      )}
      <ScrollArea className={scrollAreaClassName}>
        <pre ref={mergeRefs(preRef, ref)} data-lang={lang} className={cn('p-4 text-[13px]', className)} {...rest}>
          {children}
        </pre>
      </ScrollArea>
    </figure>
  )
}
