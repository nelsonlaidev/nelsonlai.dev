import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  SegmentGroup,
  SegmentGroupItem,
  SegmentGroupRootProvider,
  useSegmentGroup,
} from '@repo/ui/components/segment-group'

const meta = {
  title: 'Actions and forms/Segment group',
  parameters: {
    docs: {
      description: {
        component:
          'Import SegmentGroup, SegmentGroupItem, SegmentGroupRootProvider, and useSegmentGroup from @repo/ui/components/segment-group. This Ark UI control includes hidden inputs and an animated selection indicator. Use arrow keys to change selection.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const Sizes: Story = {
  render: () => (
    <div className='space-y-4'>
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <div key={size}>
          <SegmentGroup size={size} defaultValue='overview' aria-label={`${size} view`}>
            <SegmentGroupItem value='overview'>Overview</SegmentGroupItem>
            <SegmentGroupItem value='details'>Details</SegmentGroupItem>
            <SegmentGroupItem value='disabled' disabled>
              Disabled
            </SegmentGroupItem>
          </SegmentGroup>
        </div>
      ))}
    </div>
  ),
}

export const VerticalAndInvalid: Story = {
  render: () => (
    <div className='flex flex-wrap gap-6'>
      <SegmentGroup orientation='vertical' defaultValue='overview' aria-label='Vertical view'>
        <SegmentGroupItem value='overview'>Overview</SegmentGroupItem>
        <SegmentGroupItem value='details'>Longer details label</SegmentGroupItem>
      </SegmentGroup>
      <SegmentGroup defaultValue='overview' invalid aria-label='Invalid view'>
        <SegmentGroupItem value='overview'>Overview</SegmentGroupItem>
        <SegmentGroupItem value='details'>Details</SegmentGroupItem>
      </SegmentGroup>
      <SegmentGroup disabled defaultValue='overview' aria-label='Disabled view'>
        <SegmentGroupItem value='overview'>Overview</SegmentGroupItem>
        <SegmentGroupItem value='details'>Details</SegmentGroupItem>
      </SegmentGroup>
    </div>
  ),
}

function ExternalState() {
  const group = useSegmentGroup({ defaultValue: 'first' })

  return (
    <div className='space-y-3'>
      <SegmentGroupRootProvider value={group} aria-label='Externally managed view'>
        <SegmentGroupItem value='first'>First</SegmentGroupItem>
        <SegmentGroupItem value='second'>Second</SegmentGroupItem>
      </SegmentGroupRootProvider>
      <p>Selected: {group.value}</p>
    </div>
  )
}

export const RootProvider: Story = {
  render: () => <ExternalState />,
}
