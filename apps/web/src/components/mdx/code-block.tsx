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
      variant='ghost'
      size='icon-sm'
      className={cn(
        'opacity-100 transition-opacity',
        hasCaption
          ? 'm-0 size-auto min-h-11 min-w-11 shrink-0 gap-0 rounded-md border border-[#8cae9d55] bg-[#12303a] bg-clip-border px-3.5 py-2 text-sm/5 text-[#d6eee3] opacity-100 hover:bg-[#12303a] hover:text-[#d6eee3] focus-visible:border-[#8cae9d55] dark:hover:bg-[#12303a]'
          : 'absolute top-2 right-2 z-10 size-8 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100',
      )}
      onClick={() => {
        void copyCode()
      }}
      aria-label={m.common_aria_labels_copy_code()}
    >
      {copied ? (
        <CheckIcon className={cn('size-3.5', hasCaption && 'hidden size-4.5')} aria-hidden='true' />
      ) : (
        <CopyIcon className={cn('size-3.5', hasCaption && 'hidden size-4.5')} aria-hidden='true' />
      )}
      <span className='inline'>{copied ? m.ocean_code_copied() : m.ocean_code_copy()}</span>
    </Button>
  )

  return (
    <figure
      className={cn(
        'not-prose group relative my-6.25 mb-8.75 overflow-hidden rounded-xl border border-[#8cae9d28] bg-[#03131ff0] text-sm',
        figureClassName,
      )}
    >
      {hasCaption ? (
        <div className='flex flex-row items-center gap-x-5 gap-y-2 border-b border-b-[#8cae9d20] bg-transparent px-4.5 py-3 text-sm/5 max-[601px]:gap-2 max-[601px]:px-3.5 max-[601px]:py-2.75'>
          <div className='hidden text-muted-foreground'>
            <Icon className='size-3.5' aria-hidden='true' />
          </div>
          <figcaption className='m-0 flex-1 truncate leading-[1.8] wrap-anywhere whitespace-normal text-[#bfd3c9]'>
            {title ?? lang}
          </figcaption>
          {copyButton}
        </div>
      ) : (
        copyButton
      )}
      <ScrollArea className={scrollAreaClassName}>
        <pre
          ref={mergeRefs(preRef, ref)}
          data-lang={lang}
          className={cn(
            'bg-transparent px-0! py-5! text-sm leading-[1.85]! [&>code]:block [&>code]:w-max [&>code]:min-w-full [&>code]:font-mono',
            className,
          )}
          {...rest}
        >
          {children}
        </pre>
      </ScrollArea>
    </figure>
  )
}
