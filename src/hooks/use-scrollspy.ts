import { useEffect, useRef, useState } from 'react'

export function useScrollspy(ids: string[], options: IntersectionObserverInit): string | undefined {
  const [activeId, setActiveId] = useState<string>()
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const elements = ids.map((id) => document.querySelector(`#${id}`))

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
        }
      }
    }, options)

    for (const el of elements) {
      if (el) observerRef.current.observe(el)
    }

    return () => observerRef.current?.disconnect()
  }, [ids, options])

  return activeId
}
