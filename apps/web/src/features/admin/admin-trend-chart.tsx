import type { ChartConfig } from '@repo/ui/components/chart'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/chart'
import { Skeleton } from '@repo/ui/components/skeleton'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

export function TrendsChart() {
  const { data, isSuccess, isError } = useQuery(
    orpc.admin.trends.queryOptions({
      input: { days: 30, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      placeholderData: keepPreviousData,
    }),
  )
  const locale = getLocale()

  const chartConfig = {
    comments: {
      label: m.admin_dashboard_trends_comments(),
      color: 'var(--chart-1)',
    },
    messages: {
      label: m.admin_dashboard_trends_messages(),
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig

  let content: React.ReactNode = <Skeleton className='h-62.5 w-full' />

  if (isSuccess && data.length > 0) {
    content = (
      <ChartContainer config={chartConfig} className='aspect-auto h-62.5 w-full'>
        <AreaChart accessibilityLayer data={data} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='date'
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: string) => {
              const date = new Date(value)
              return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' })
            }}
            minTickGap={32}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(label) => {
                  const date = new Date(label as string | number)

                  return date.toLocaleDateString(locale, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                }}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            dataKey='comments'
            type='monotone'
            fill='var(--color-comments)'
            fillOpacity={0.3}
            stroke='var(--color-comments)'
          />
          <Area
            dataKey='messages'
            type='monotone'
            fill='var(--color-messages)'
            fillOpacity={0.3}
            stroke='var(--color-messages)'
          />
        </AreaChart>
      </ChartContainer>
    )
  } else if (isSuccess) {
    content = <p className='text-sm text-muted-foreground'>{m.admin_dashboard_trends_no_data()}</p>
  } else if (isError) {
    content = <p className='text-sm text-destructive'>{m.error_failed_to_fetch_dashboard_data()}</p>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.admin_dashboard_trends_title()}</CardTitle>
        <CardDescription>{m.admin_dashboard_trends_last_n_days({ days: 30 })}</CardDescription>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}
