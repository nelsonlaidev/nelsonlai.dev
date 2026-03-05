'use client'

import { useEffect, useRef, useState } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

type TipProps = {
  children: React.ReactNode
  content: React.ReactNode
}

export function Tip(props: TipProps) {
  const { children, content } = props
  const [open, setOpen] = useState(false)
  const [canHover, setCanHover] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const mql = globalThis.matchMedia('(hover: hover)')
    setCanHover(mql.matches)
    function onChange(e: MediaQueryListEvent) {
      setCanHover(e.matches)
    }
    mql.addEventListener('change', onChange)
    return () => {
      mql.removeEventListener('change', onChange)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: TouchEvent) {
      if (!buttonRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  return (
    <Tooltip
      open={open}
      onOpenChange={(nextOpen) => {
        if (canHover) setOpen(nextOpen)
      }}
    >
      <TooltipTrigger
        render={
          <button
            type='button'
            className='cursor-pointer'
            ref={buttonRef}
            onClick={() => {
              if (!canHover) setOpen((v) => !v)
            }}
          >
            {children}
          </button>
        }
      />
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}
