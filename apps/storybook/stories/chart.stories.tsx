import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/chart'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const meta = {
  title: 'Data and display/Chart',
  component: ChartContainer,
  parameters: {
    docs: {
      description: {
        component:
          'Import `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, and `ChartLegendContent` from `@repo/ui/components/chart`. Use Recharts for the actual chart. The container supplies context, responsive sizing, and nonce-bearing series styles through ChartStyle. Give charts a text description as well as color.',
      },
    },
  },
} satisfies Meta<typeof ChartContainer>

export default meta

type Story = StoryObj

const config = {
  visits: { label: 'Visits', color: 'var(--chart-1)' },
  messages: { label: 'Messages', color: 'var(--chart-2)' },
}

const data = [
  { month: 'Jan', visits: 120, messages: 24 },
  { month: 'Feb', visits: 180, messages: 38 },
  { month: 'Mar', visits: 140, messages: 19 },
]

export const Responsive: Story = {
  render: () => (
    <ChartContainer config={config} className='max-w-2xl' aria-label='Visits and messages from January to March'>
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey='month' />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey='visits' fill='var(--color-visits)' radius={4} />
        <Bar dataKey='messages' fill='var(--color-messages)' radius={4} />
      </BarChart>
    </ChartContainer>
  ),
}

export const TooltipIndicators: Story = {
  render: () => (
    <div className='grid gap-4 sm:grid-cols-3'>
      {(['dot', 'line', 'dashed'] as const).map((indicator) => (
        <ChartContainer key={indicator} config={config}>
          <BarChart data={data} accessibilityLayer>
            <XAxis dataKey='month' />
            <Bar dataKey='visits' fill='var(--color-visits)' />
            <ChartTooltip active defaultIndex={0} content={<ChartTooltipContent indicator={indicator} />} />
          </BarChart>
        </ChartContainer>
      ))}
    </div>
  ),
}

export const FormattingAndHiddenLabels: Story = {
  render: () => (
    <ChartContainer config={config} className='max-w-xl' aria-label='Visits with a custom tooltip formatter'>
      <BarChart data={data} accessibilityLayer>
        <XAxis dataKey='month' />
        <Bar dataKey='visits' fill='var(--color-visits)' />
        <ChartTooltip
          active
          defaultIndex={0}
          content={
            <ChartTooltipContent hideLabel hideIndicator formatter={(value) => <span>{String(value)} visits</span>} />
          }
        />
        <ChartLegend content={<ChartLegendContent hideIcon position='top' />} />
      </BarChart>
    </ChartContainer>
  ),
}

export const EmptyData: Story = {
  render: () => (
    <div className='max-w-xl space-y-3'>
      <ChartContainer config={config} aria-label='Empty visits chart'>
        <BarChart data={[]} accessibilityLayer>
          <XAxis dataKey='month' />
          <Bar dataKey='visits' fill='var(--color-visits)' />
        </BarChart>
      </ChartContainer>
      <p className='text-sm text-muted-foreground'>
        No data for this period. Empty-state copy is supplied by the caller.
      </p>
    </div>
  ),
}
