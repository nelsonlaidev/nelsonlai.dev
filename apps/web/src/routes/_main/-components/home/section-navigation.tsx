import { cn } from 'cn'
import { useEffect, useState } from 'react'

import { m } from '@/paraglide/messages'

const SECTIONS = [
  { id: 'home', label: m.nav_home },
  { id: 'projects', label: m.nav_projects },
  { id: 'blog', label: m.nav_blog },
  { id: 'about', label: m.nav_about },
]

export function SectionNavigation() {
  const [active, setActive] = useState('home')
  const [depth, setDepth] = useState(0)

  useEffect(() => {
    let frame = 0

    const updateDepth = () => {
      frame = 0

      setDepth(
        Math.round(
          Math.min(
            1,
            Math.max(0, window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)),
          ) * 240,
        ),
      )
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updateDepth)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-35% 0px -40% 0px', threshold: 0 },
    )

    for (const { id } of SECTIONS) {
      const section = document.querySelector(`#${id}`)
      if (section) observer.observe(section)
    }

    const resize = new ResizeObserver(schedule)
    resize.observe(document.documentElement)

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    schedule()

    return () => {
      cancelAnimationFrame(frame)

      observer.disconnect()
      resize.disconnect()

      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  let depthLabel = m.home_chapters_depth_quiet()

  if (active === 'home' || active === 'projects') {
    depthLabel = m.home_chapters_depth_sunlit()
  } else if (active === 'about') {
    depthLabel = m.home_chapters_depth_floor()
  }

  return (
    <>
      <nav
        aria-label={m.home_chapters_label()}
        className='fixed top-1/2 right-2.5 z-30 flex -translate-y-1/2 flex-col gap-2 md:right-8 md:gap-2.5'
      >
        {SECTIONS.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={active === section.id ? 'location' : undefined}
            className='group flex h-7 items-center justify-end gap-2.5'
          >
            <span className='sr-only text-xs group-hover:not-sr-only group-focus-visible:not-sr-only'>
              {section.label()}
            </span>
            <span
              className={cn(
                'h-px w-2 bg-muted-foreground transition-[width] motion-reduce:transition-none md:w-3',
                active === section.id && 'w-3.5 bg-primary md:w-6',
              )}
              aria-hidden='true'
            />
          </a>
        ))}
      </nav>
      <div
        aria-hidden='true'
        className='pointer-events-none fixed right-3 bottom-5 z-20 rounded-sm bg-background/75 p-2 text-xs text-muted-foreground md:right-auto md:bottom-9 md:left-6 md:bg-transparent md:p-0 md:[writing-mode:vertical-rl]'
      >
        {String(depth).padStart(3, '0')} m <span className='hidden md:inline'>{depthLabel}</span>
      </div>
    </>
  )
}
