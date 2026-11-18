import { SkeletonBox } from 'skullet/react'

import { m } from '@/paraglide/messages'

type PendingCountProps = {
  children?: React.ReactNode
}

export function PendingCount(props: PendingCountProps) {
  const { children = '000' } = props

  return (
    <output className='relative inline-block align-baseline'>
      <span className='sr-only'>{m.common_aria_labels_loading()}</span>
      <span aria-hidden='true' className='invisible'>
        {children}
      </span>
      <SkeletonBox width='100%' height='100%' className='absolute inset-0' />
    </output>
  )
}
