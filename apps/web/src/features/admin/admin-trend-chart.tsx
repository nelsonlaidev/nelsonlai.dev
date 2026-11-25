import type { ChartConfig } from '@repo/ui/components/chart'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@repo/ui/components/chart'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { SkeletonBox } from 'skullet/react'

import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'
import { getLocale } from '@/paraglide/runtime'

function formatTrendDate(day: string, locale: string, options: Intl.DateTimeFormatOptions) {
  // Format in UTC to preserve the calendar day returned by the API.
  return new Date(day).toLocaleDateString(locale, { ...options, timeZone: 'UTC' })
}

export function AdminTrendChart() {
  const query = useQuery(
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

  let content: React.ReactNode = (
    <output className='block h-62.5'>
      <span className='sr-only'>{m.common_aria_labels_loading()}</span>
      <SkeletonBox width='100%' height='100%' />
    </output>
  )

  if (query.data?.length) {
    content = (
      <ChartContainer config={chartConfig} className='aspect-auto h-62.5 w-full'>
        <AreaChart accessibilityLayer data={query.data} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='date'
            tick={{ fill: 'var(--muted-foreground)', fontSize: 14 }}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value: string) => formatTrendDate(value, locale, { month: 'short', day: 'numeric' })}
            minTickGap={32}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(label) =>
                  formatTrendDate(label as string, locale, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })
                }
              />
            }
          />
          <ChartLegend content={<ChartLegendContent className='text-sm' />} />
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
  } else if (query.data) {
    content = <p className='text-sm text-muted-foreground'>{m.admin_dashboard_trends_no_data()}</p>
  } else if (query.isLoadingError) {
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
