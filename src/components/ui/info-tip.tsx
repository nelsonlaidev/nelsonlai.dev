'use client'

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'

import { Popover, PopoverDescription, PopoverTrigger } from './popover'
import { hintArrowClassName, hintPopupClassName } from './tooltip-styles'

type InfoTipProps = {
  children: React.ReactNode
  content: React.ReactNode
  label: string
}

export function InfoTip(props: InfoTipProps) {
  const { children, content, label } = props

  return (
    <Popover>
      <PopoverTrigger openOnHover aria-label={label} className='cursor-pointer'>
        {children}
      </PopoverTrigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner side='top' sideOffset={4} className='isolate z-50'>
          <PopoverPrimitive.Popup aria-label={label} className={hintPopupClassName}>
            <PopoverDescription className='text-inherit'>{content}</PopoverDescription>
            <PopoverPrimitive.Arrow className={hintArrowClassName} />
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </Popover>
  )
}
