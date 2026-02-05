'use client'

import { useEffect, useRef, useState } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type TipProps = {
  children: React.ReactNode
  content: React.ReactNode
}

function Tip(props: TipProps) {
  const { children, content } = props
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const canHover = globalThis.matchMedia('(hover: hover)').matches

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
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger
        render={
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
        }
      />
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  )
}

export default Tip
