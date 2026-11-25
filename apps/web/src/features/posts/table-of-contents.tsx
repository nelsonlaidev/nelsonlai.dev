import type { TOC } from '@repo/mdx'

import { cn } from 'cn'
import { useEffect, useState } from 'react'

import { m } from '@/paraglide/messages'

type TableOfContentsProps = {
  toc: TOC[]
  children?: React.ReactNode
}

export function TableOfContents(props: TableOfContentsProps) {
  const { toc, children } = props
  const [activeId, setActiveId] = useState<string>()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-15% 0px -65% 0px' },
    )

    for (const item of toc) {
      const element = document.querySelector(`#${CSS.escape(item.url)}`)
      if (element) observer.observe(element)
    }

    return () => {
      observer.disconnect()
    }
  }, [toc])

  return (
    <aside className='mb-11 self-start overflow-y-auto border-b pb-7 lg:sticky lg:top-9 lg:mb-0 lg:max-h-[calc(100dvh-(--spacing(9)*2))] lg:border-b-0 lg:pb-0'>
      <span className='mb-3 block text-xs text-muted-foreground'>{m.blog_on_this_page()}</span>
      <nav aria-label={m.blog_on_this_page()} className='grid grid-cols-1 gap-y-1'>
        {toc.map((item) => (
          <a
            key={item.url}
            href={`#${encodeURIComponent(item.url)}`}
            aria-current={activeId === item.url ? 'location' : undefined}
            className={cn(
              'border-l py-1 pl-3 text-sm text-muted-foreground hover:text-foreground focus-visible:-outline-offset-2 aria-[current=location]:border-l-primary aria-[current=location]:text-foreground',
              item.depth === 3 && 'pl-6',
              item.depth === 4 && 'pl-9',
              item.depth === 5 && 'pl-12',
              item.depth === 6 && 'pl-16',
            )}
          >
            {item.title}
          </a>
        ))}
      </nav>
      {children}
    </aside>
  )
}
