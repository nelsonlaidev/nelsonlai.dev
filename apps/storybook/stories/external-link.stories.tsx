import type { Meta, StoryObj } from '@storybook/react-vite'

import { ExternalLink } from '@repo/ui/components/external-link'

const meta = {
  title: 'Data and display/External link',
} satisfies Meta

export default meta

type Story = StoryObj

export const Targets: Story = {
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
}
