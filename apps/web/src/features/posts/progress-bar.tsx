import { motion, useScroll } from 'motion/react'

export function ProgressBar() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      aria-hidden='true'
      className='fixed inset-x-0 top-0 z-50 h-1 origin-left bg-foreground'
      style={{ scaleX: scrollYProgress }}
    />
  )
}
