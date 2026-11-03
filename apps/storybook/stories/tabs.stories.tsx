import type { Meta, StoryObj } from '@storybook/react-vite'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs'

const meta = {
  title: 'Structure and navigation/Tabs',
  parameters: {
    docs: {
      description: {
        component:
          'Import the Tabs* parts and tabsListVariants from @repo/ui/components/tabs. Lists support default/line appearances; roots support horizontal/vertical orientation. Arrow keys navigate tabs; panels retain their semantic relationships.',
      },
    },
  },
} satisfies Meta

export default meta

type Story = StoryObj

export const Variants: Story = {
  render: () => (
    <div className='max-w-xl space-y-8'>
      {(['default', 'line'] as const).map((variant) => (
        <Tabs key={variant} defaultValue='overview'>
          <TabsList variant={variant} aria-label={`${variant} tabs`}>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='details'>Details</TabsTrigger>
            <TabsTrigger value='disabled' disabled>
              Disabled
            </TabsTrigger>
          </TabsList>
          <TabsContent value='overview'>Overview content for the {variant} list.</TabsContent>
          <TabsContent value='details'>Details selected using the actual tabs primitive.</TabsContent>
        </Tabs>
      ))}
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Tabs orientation='vertical' defaultValue='first' className='max-w-lg'>
      <TabsList aria-label='Vertical tabs'>
        <TabsTrigger value='first'>First section</TabsTrigger>
        <TabsTrigger value='second'>A longer second section</TabsTrigger>
      </TabsList>
      <TabsContent value='first'>First panel</TabsContent>
      <TabsContent value='second'>Second panel</TabsContent>
    </Tabs>
  ),
}
