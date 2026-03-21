'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'

function subscribeHover(onStoreChange: () => void) {
  const mql = globalThis.matchMedia('(hover: hover)')
  mql.addEventListener('change', onStoreChange)
  return () => {
    mql.removeEventListener('change', onStoreChange)
  }
}

function getCanHover() {
  return globalThis.matchMedia('(hover: hover)').matches
}

function getCanHoverServer() {
  return false
}

type TipProps = {
  children: React.ReactNode
  content: React.ReactNode
}

export function Tip(props: TipProps) {
  const { children, content } = props
  const [open, setOpen] = useState(false)
  const canHover = useSyncExternalStore(subscribeHover, getCanHover, getCanHoverServer)
  const buttonRef = useRef<HTMLButtonElement>(null)

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
