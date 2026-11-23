import { ExternalLink } from '@repo/ui/components/external-link'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/External link',
})

export const Targets = meta.story({
  render: () => (
    <div className='flex flex-wrap gap-6'>
      <ExternalLink href='/reef.svg' className='text-link underline'>
        Local image in a new tab
      </ExternalLink>
      <ExternalLink href='/reef.svg' target='_self' className='text-link underline'>
        Same tab
      </ExternalLink>
      <ExternalLink href='/reef.svg' rel='noreferrer' className='text-link underline'>
        Preserved noreferrer
      </ExternalLink>
    </div>
  ),
})
