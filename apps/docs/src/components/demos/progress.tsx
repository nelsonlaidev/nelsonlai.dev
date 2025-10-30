'use client'

import { Progress } from '@repo/ui/components/progress'
import { useEffect, useState } from 'react'

const ProgressDemo = () => {
  const [progress, setProgress] = useState(13)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(66)
    }, 500)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return <Progress value={progress} className='w-[60%]' />
}

export default ProgressDemo
