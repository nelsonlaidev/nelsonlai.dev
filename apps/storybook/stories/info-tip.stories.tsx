import type { Meta, StoryObj } from '@storybook/react-vite'

import { InfoTip } from '@repo/ui/components/info-tip'
import { InfoIcon } from 'lucide-react'

const meta = {
  title: 'Overlays and feedback/Info tip',
  parameters: {
    docs: {
      description: {
        component:
          'Import { InfoTip } from @repo/ui/components/info-tip. This compact popover supports hover and click/touch. Supply label for the trigger and content for the explanation. Children belong on InfoTip; it creates the trigger itself.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const Explanation: Story = {
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
}
