'use client'

import { motion } from 'motion/react'

type PageTitleProps = {
  title: string
  description: string
}

const animation = {
  hide: {
    x: -30,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
  },
}

function PageHeader(props: PageTitleProps) {
  const { title, description } = props

  return (
    <div className='flex flex-col gap-2.5 pt-12 pb-16'>
      <motion.h1 className='text-4xl font-semibold' initial={animation.hide} animate={animation.show}>
        {title}
      </motion.h1>
      <motion.h2
        className='text-muted-foreground'
        initial={animation.hide}
        animate={animation.show}
        transition={{ delay: 0.1 }}
      >
        {description}
      </motion.h2>
    </div>
  )
}

export default PageHeader
