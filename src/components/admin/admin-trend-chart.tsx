'use client'

import type { ChartConfig } from '../ui/chart'

import { useLocale, useTranslations } from 'next-intl'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import { useAdminTrends } from '@/hooks/queries/admin.query'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '../ui/chart'
import { Skeleton } from '../ui/skeleton'

export function TrendsChart() {
  const { data, isSuccess, isLoading, isError } = useAdminTrends(30)
  const t = useTranslations()
  const locale = useLocale()

  const chartConfig = {
    comments: {
      label: t('admin.dashboard.trends.comments'),
      color: 'var(--chart-1)',
    },
    messages: {
      label: t('admin.dashboard.trends.messages'),
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.dashboard.trends.title')}</CardTitle>
        <CardDescription>{t('admin.dashboard.trends.last-n-days', { days: 30 })}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className='h-62.5 w-full' />}
        {isError && <p className='text-sm text-destructive'>{t('error.failed-to-fetch-dashboard-data')}</p>}
        {isSuccess &&
          (data.length > 0 ? (
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
                      labelFormatter={(label: string) => {
                        const date = new Date(label)

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
          ) : (
            <p className='text-sm text-muted-foreground'>{t('admin.dashboard.trends.no-data')}</p>
          ))}
      </CardContent>
    </Card>
  )
}
