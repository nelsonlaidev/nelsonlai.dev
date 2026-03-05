'use client'

import { InfoIcon } from 'lucide-react'

import { Demo, DemoItem } from './demo'
import { Tip } from './tip'

export default function TipDemo() {
  return (
    <Demo title='Tip'>
      <TipBasic />
      <TipWithIcon />
      <TipLongContent />
    </Demo>
  )
}

function TipBasic() {
  return (
    <DemoItem title='Basic'>
      <Tip content='This is a tip'>
        <span className='cursor-pointer underline decoration-dashed underline-offset-4'>Hover or tap me</span>
      </Tip>
    </DemoItem>
  )
}

function TipWithIcon() {
  return (
    <DemoItem title='With Icon'>
      <Tip content='Additional information about this feature'>
        <InfoIcon className='size-4' />
      </Tip>
    </DemoItem>
  )
}

function TipLongContent() {
  return (
    <DemoItem title='Long Content'>
      <Tip content='To learn more about how this works, check out the docs. If you have any questions, please reach out to us.'>
        <span className='cursor-pointer underline decoration-dashed underline-offset-4'>Hover or tap for details</span>
      </Tip>
    </DemoItem>
  )
}
