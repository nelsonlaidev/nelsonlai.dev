import { Badge } from '@repo/ui/components/badge'
import { CheckIcon } from 'lucide-react'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Badge',
})

export const Variants = meta.story({
  render: () => (
    <div className='flex flex-wrap gap-3'>
      {(['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
})

export const Composition = meta.story({
  render: () => (
    <div className='flex flex-wrap gap-3'>
      <Badge>
        <CheckIcon aria-hidden='true' data-icon='inline-start' />
        Published
      </Badge>
      <Badge render={<a href='#badge-destination' />} variant='outline'>
        Local link
      </Badge>
      <Badge aria-invalid='true'>Invalid</Badge>
    </div>
  ),
})
