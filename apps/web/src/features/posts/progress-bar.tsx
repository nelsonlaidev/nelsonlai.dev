import { motion, useScroll } from 'motion/react'

export function ProgressBar() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      aria-hidden='true'
      className='fixed inset-x-0 top-0 left-0 z-30 h-0.5 origin-left bg-[#c4e1c3]'
      style={{ scaleX: scrollYProgress }}
    />
  )
}
