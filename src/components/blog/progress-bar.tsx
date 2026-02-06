'use client'

import { motion, useScroll } from 'motion/react'

function ProgressBar() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className='fixed inset-x-0 top-0 z-50 h-1 origin-left bg-foreground'
      style={{
        scaleX: scrollYProgress,
      }}
    />
  )
}

export default ProgressBar
