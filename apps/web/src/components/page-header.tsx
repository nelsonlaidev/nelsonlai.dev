import { motion, useReducedMotion } from 'motion/react'

type PageHeaderProps = {
  title: string
  description: string
}

const variants = {
  hide: { x: -30, opacity: 0 },
  show: { x: 0, opacity: 1 },
}

export function PageHeader(props: PageHeaderProps) {
  const { title, description } = props
  const reducedMotion = useReducedMotion()

  return (
    <div className='flex flex-col gap-2.5 pt-12 pb-16'>
      <motion.h1
        className='text-4xl font-semibold'
        variants={variants}
        initial={reducedMotion ? false : 'hide'}
        animate='show'
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
      >
        {title}
      </motion.h1>
      <motion.p
        className='text-muted-foreground'
        variants={variants}
        initial={reducedMotion ? false : 'hide'}
        animate='show'
        transition={{ duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : 0.1 }}
      >
        {description}
      </motion.p>
    </div>
  )
}
