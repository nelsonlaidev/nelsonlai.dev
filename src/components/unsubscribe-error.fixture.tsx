'use client'

import { Demo, DemoItem } from './ui/demo'
import { UnsubscribeError } from './unsubscribe-error'

export default function UnsubscribeErrorDemo() {
  return (
    <Demo title='Unsubscribe Error'>
      <DemoItem className='justify-center'>
        <UnsubscribeError />
      </DemoItem>
    </Demo>
  )
}
