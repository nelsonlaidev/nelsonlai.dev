import { Skeleton } from 'skullet/react'

import { m } from '@/paraglide/messages'

import { OceanPage } from './ocean-page'
import { PageHeader } from './page-header'

type PagePendingProps = {
  title: string
  description?: string
  narrow?: boolean
}

export function PagePending(props: PagePendingProps) {
  const { title, description = 'Details and information about this page.', narrow } = props

  return (
    <OceanPage>
      <div className={narrow ? 'mx-auto max-w-prose' : undefined}>
        <output className='sr-only'>{m.common_aria_labels_loading()}</output>
        <Skeleton loading>
          <PageHeader title={title} description={description} />
        </Skeleton>
      </div>
    </OceanPage>
  )
}
