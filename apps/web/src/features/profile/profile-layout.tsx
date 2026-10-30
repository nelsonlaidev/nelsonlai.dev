import type { ErrorComponentProps } from '@tanstack/react-router'

import { OceanPage } from '@/components/ocean-page'
import { RouteError } from '@/components/route-error'
import { m } from '@/paraglide/messages'

export type ProfilePageData = {
  title: string
  description: string
  mdx: string
  sections?: Array<{ id: string; title: string; count: number }>
}

export function ProfileLayout(props: { children: React.ReactNode }) {
  return (
    <OceanPage>
      <div className='wrap-anywhere'>{props.children}</div>
    </OceanPage>
  )
}

export function ProfilePending() {
  return (
    <ProfileLayout>
      <output className='block text-muted-foreground'>{m.common_loading()}</output>
    </ProfileLayout>
  )
}

export function ProfileError(props: ErrorComponentProps) {
  return (
    <ProfileLayout>
      <RouteError {...props} />
    </ProfileLayout>
  )
}
