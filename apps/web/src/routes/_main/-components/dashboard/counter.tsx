import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'

import { getLocale } from '@/paraglide/runtime'

type CounterProps = {
  value: number
}

export function Counter(props: CounterProps) {
  const { value } = props

  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const reducedMotion = useReducedMotion()
  const locale = getLocale()
  const formattedValue = new Intl.NumberFormat(locale).format(value)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const formatter = new Intl.NumberFormat(locale)
    if (!isInView || reducedMotion) {
      element.textContent = formatter.format(value)
      return
    }

    const controls = animate(0, value, {
      duration: 1,
      ease: 'easeOut',
      onUpdate: (latest) => {
        element.textContent = formatter.format(Math.round(latest))
      },
    })

    return () => {
      controls.stop()
    }
  }, [isInView, locale, reducedMotion, value])

  return (
    <>
      <span ref={ref} aria-hidden='true'>
        {formattedValue}
      </span>
      <span className='sr-only'>{formattedValue}</span>
    </>
  )
}
