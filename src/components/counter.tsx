import { useInView, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef } from 'react'

type CounterProps = {
  value: number
  direction?: 'up' | 'down'
} & React.ComponentProps<'span'>

function Counter(props: CounterProps) {
  const { value, direction = 'up', ...rest } = props
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === 'down' ? value : 0)
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 300,
  })
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) motionValue.set(direction === 'down' ? 0 : value)
  }, [motionValue, isInView, direction, value])

  useEffect(() => {
    if (ref.current && value === 0) {
      ref.current.textContent = '0'

      return
    }

    springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toFixed(0)
      }
    })
  }, [springValue, value])

  return (
    <span ref={ref} {...rest}>
      0
    </span>
  )
}

export default Counter
