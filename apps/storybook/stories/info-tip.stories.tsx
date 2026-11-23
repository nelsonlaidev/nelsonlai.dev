import { InfoTip } from '@repo/ui/components/info-tip'
import { InfoIcon } from 'lucide-react'

import preview from '../.storybook/preview'

const meta = preview.meta({
  title: 'Components/Info tip',
})

export const Explanation = meta.story({
  render: () => (
    <div className='flex items-center gap-2 py-12'>
      <span>Storage usage</span>
      <InfoTip
        label='About storage usage'
        content='Includes local example assets. No account or storage API is contacted.'
      >
        <InfoIcon aria-hidden='true' className='size-5' />
      </InfoTip>
    </div>
  ),
})
