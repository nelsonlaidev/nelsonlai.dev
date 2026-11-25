import { Spinner } from '@repo/ui/components/spinner'
import { useEffect, useState } from 'react'

export function NavigationSpinner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true)
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  if (!visible) return null

  return (
    <div className='pointer-events-none fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full border bg-background p-2 text-foreground shadow-sm'>
      <Spinner />
    </div>
  )
}
