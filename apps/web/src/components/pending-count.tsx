import { SkeletonBox } from 'skullet/react'

import { m } from '@/paraglide/messages'

export function PendingCount() {
  return (
    <output className='inline-block align-baseline'>
      <span className='sr-only'>{m.common_aria_labels_loading()}</span>
      <SkeletonBox width='3ch' height='0.8em' />
    </output>
  )
}
