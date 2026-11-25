import { SkeletonBox } from 'skullet/react'

import { LoadingStatus } from '@/components/loading-status'

type PendingCountProps = {
  children?: React.ReactNode
}

export function PendingCount(props: PendingCountProps) {
  const { children = '000' } = props

  return (
    <span className='relative inline-block align-baseline'>
      <LoadingStatus />
      <span aria-hidden='true' className='invisible'>
        {children}
      </span>
      <SkeletonBox width='100%' height='100%' className='absolute inset-0' />
    </span>
  )
}
