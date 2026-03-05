'use client'

import type { DecoratorProps } from 'react-cosmos-core'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from './ui/button'

function Decorator(props: DecoratorProps) {
  const { children } = props
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div className='mx-auto w-full max-w-3xl bg-background p-8 text-foreground'>
      {children}
      <Button
        type='button'
        onClick={() => {
          setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
        }}
        size='icon'
        className='fixed right-4 bottom-4'
      >
        {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </Button>
    </div>
  )
}

export default Decorator
