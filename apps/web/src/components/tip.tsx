'use client'

import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip'
import { useEffect, useRef, useState } from 'react'

type TipProps = {
  children: React.ReactNode
  content: React.ReactNode
}

const Tip = ({ children, content }: TipProps) => {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const canHover = globalThis.matchMedia('(hover: hover)').matches

  useEffect(() => {
    const handleClickOutside = (event: TouchEvent) => {
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
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type='button'
          className='cursor-pointer'
          ref={buttonRef}
          onClick={() => {
            if (!canHover) setOpen((v) => !v)
          }}
          onMouseEnter={() => {
            if (canHover) setOpen(true)
          }}
          onMouseLeave={() => {
            if (canHover) setOpen(false)
          }}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}

export default Tip
