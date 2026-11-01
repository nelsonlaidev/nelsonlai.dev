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
        for (const entry of entries) if (entry.isIntersecting) setActiveId(entry.target.id)
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
    <aside className='sticky top-8.75 max-h-[calc(100vh-70px)] self-start overflow-y-auto max-[1001px]:static max-[1001px]:mb-11.25 max-[1001px]:max-h-none max-[1001px]:border-b max-[1001px]:border-b-border max-[1001px]:pb-7'>
      <span className='mb-6 block text-xs leading-[normal] tracking-[normal] text-section-label'>
        {m.blog_on_this_page()}
      </span>
      <nav
        aria-label={m.blog_on_this_page()}
        className='flex flex-col gap-4.25 max-[1001px]:grid max-[1001px]:grid-cols-2 max-[1001px]:gap-x-6.25 max-[1001px]:gap-y-3.5 max-[601px]:grid-cols-1 max-[601px]:gap-3.25'
      >
        {toc.map((item) => (
          <a
            key={item.url}
            href={`#${encodeURIComponent(item.url)}`}
            aria-current={activeId === item.url ? 'location' : undefined}
            className={cn(
              'min-h-11 border-l border-l-[#6e928640] py-2 pl-3.25 text-sm leading-[1.6] text-[#8cafa2] aria-[current=location]:border-l-[#d6e6d2] aria-[current=location]:text-[#d6e6d2]',
              item.depth === 3 && 'pl-6.25',
              item.depth === 4 && 'pl-9.25',
              item.depth === 5 && 'pl-12.25',
              item.depth === 6 && 'pl-15.25',
            )}
          >
            {item.title}
          </a>
        ))}
        <a
          href='#comments'
          className='min-h-11 border-l border-l-[#6e928640] py-2 pl-3.25 text-sm leading-[1.6] text-[#8cafa2] aria-[current=location]:border-l-[#d6e6d2] aria-[current=location]:text-[#d6e6d2]'
        >
          {m.blog_comments_conversation()}
        </a>
      </nav>
      <a href='#main-content' className='mt-7.5 block text-sm/normal text-[#8cafaa] max-[1001px]:hidden'>
        {m.blog_top()}
      </a>
      {children}
    </aside>
  )
}
