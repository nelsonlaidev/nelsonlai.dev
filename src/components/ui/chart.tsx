'use client'

import type { TooltipValueType } from 'recharts'

import { cn } from 'cn'
import { createContext, use, useId, useMemo } from 'react'
import * as RechartsPrimitive from 'recharts'

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: '', dark: '.dark' } as const

const INITIAL_DIMENSION = { width: 320, height: 200 } as const

type TooltipNameType = number | string

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | {
        color?: string
        theme?: never
      }
    | {
        color?: never
        theme: Record<keyof typeof THEMES, string>
      }
  )
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = createContext<ChartContextProps | null>(null)
ChartContext.displayName = 'ChartContext'

function useChart() {
  const context = use(ChartContext)

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />')
  }

  return context
}

type ChartContainerProps = {
  config: ChartConfig
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children']
  initialDimension?: {
    width: number
    height: number
  }
} & React.ComponentProps<'div'>

export function ChartContainer(props: ChartContainerProps) {
  const { id, className, children, config, initialDimension = INITIAL_DIMENSION, ...rest } = props

  const uniqueId = useId()
  const chartId = `chart-${id ?? uniqueId.replaceAll(':', '')}`

  const contextValue = useMemo(() => ({ config }), [config])

  return (
    <ChartContext value={contextValue}>
      <div
        data-slot='chart'
        data-chart={chartId}
        className={cn(
          'flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground',
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
          '[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border',
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
          '[&_.recharts-sector]:outline-hidden',
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          '[&_.recharts-surface]:outline-hidden',
          className,
        )}
        {...rest}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer initialDimension={initialDimension}>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext>
  )
}

type ChartStyleProps = {
  id: string
  config: ChartConfig
}

export function ChartStyle(props: ChartStyleProps) {
  const { id, config } = props
  const selectorId = id
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\"')
    .replaceAll('\n', '\\a ')
    .replaceAll('\r', '\\d ')
    .replaceAll('\f', '\\c ')
  const colorConfig = Object.entries(config).filter(([, config]) => config.theme ?? config.color)

  if (colorConfig.length === 0) {
    return null
  }

  return (
    <style>
      {Object.entries(THEMES)
        .map(
          ([theme, prefix]) => `
${prefix} [data-chart="${selectorId}"] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ?? itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join('\n')}
}
`,
        )
        .join('\n')}
    </style>
  )
}

export const ChartTooltip = RechartsPrimitive.Tooltip

type ChartTooltipContentProps = {
  className?: string
  color?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: 'line' | 'dot' | 'dashed'
  nameKey?: string
  labelKey?: string
} & Pick<
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    RechartsPrimitive.DefaultTooltipContentProps<TooltipValueType, TooltipNameType>,
  'active' | 'payload' | 'label' | 'labelFormatter' | 'labelClassName' | 'formatter'
>

export function ChartTooltipContent(props: ChartTooltipContentProps) {
  const {
    active,
    payload,
    className,
    indicator = 'dot',
    hideLabel = false,
    hideIndicator = false,
    label,
    labelFormatter,
    labelClassName,
    formatter,
    color,
    nameKey,
    labelKey,
  } = props

  const { config } = useChart()

  const tooltipLabel = useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = String(labelKey ?? item?.dataKey ?? item?.name ?? 'value')
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value = !labelKey && typeof label === 'string' ? (config[label]?.label ?? label) : itemConfig?.label

    if (labelFormatter) {
      return <div className={cn('font-medium', labelClassName)}>{labelFormatter(value, payload)}</div>
    }

    if (!value) {
      return null
    }

    return <div className={cn('font-medium', labelClassName)}>{value}</div>
  }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== 'dot'

  return (
    <div
      className={cn(
        'grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl',
        className,
      )}
    >
      {nestLabel ? null : tooltipLabel}
      <div className='grid gap-1.5'>
        {payload
          .filter((item) => item.type !== 'none')
          .map((item, index) => {
            const key = String(nameKey ?? item.name ?? item.dataKey ?? 'value')
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color ?? (item.payload as { fill?: string } | undefined)?.fill ?? item.color

            return (
              <div
                // Recharts payload order provides stable row positions.
                // eslint-disable-next-line @eslint-react/no-array-index-key
                key={index}
                className={cn(
                  'flex w-full flex-wrap items-stretch gap-2 [&>svg]:size-2.5 [&>svg]:text-muted-foreground',
                  indicator === 'dot' && 'items-center',
                )}
              >
                {formatter && item.value !== undefined && item.name ? (
                  // Preserve the reference formatter payload from Recharts.
                  // eslint-disable-next-line typescript/no-unsafe-argument
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          // border-border uses the theme token, not this per-series inline CSS variable.
                          // oxlint-disable-next-line better-tailwindcss/enforce-canonical-classes
                          className={cn('shrink-0 rounded-xs border-(--color-border) bg-(--color-bg)', {
                            'size-2.5': indicator === 'dot',
                            'w-1': indicator === 'line',
                            'w-0 border-[1.5px] border-dashed bg-transparent': indicator === 'dashed',
                            'my-0.5': nestLabel && indicator === 'dashed',
                          })}
                          style={{
                            '--color-bg': indicatorColor,
                            '--color-border': indicatorColor,
                          }}
                        />
                      )
                    )}
                    <div
                      className={cn(
                        'flex flex-1 justify-between leading-none',
                        nestLabel ? 'items-end' : 'items-center',
                      )}
                    >
                      <div className='grid gap-1.5'>
                        {nestLabel ? tooltipLabel : null}
                        <span className='text-muted-foreground'>{itemConfig?.label ?? item.name}</span>
                      </div>
                      {
                        // Preserve the null guard for runtime payloads from external chart data.
                        // eslint-disable-next-line typescript/no-unnecessary-condition
                        item.value !== null && item.value !== undefined && (
                          <span className='font-mono font-medium text-foreground tabular-nums'>
                            {typeof item.value === 'number' ? item.value.toLocaleString() : String(item.value)}
                          </span>
                        )
                      }
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export const ChartLegend = RechartsPrimitive.Legend

type ChartLegendContentProps = {
  className?: string
  hideIcon?: boolean
  nameKey?: string
} & Pick<RechartsPrimitive.DefaultLegendContentProps, 'payload'> &
  Pick<RechartsPrimitive.LegendProps, 'position'>

export function ChartLegendContent(props: ChartLegendContentProps) {
  const { className, hideIcon = false, payload, position = 'bottom', nameKey } = props

  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div className={cn('flex items-center justify-center gap-4', position === 'top' ? 'pb-3' : 'pt-3', className)}>
      {payload
        .filter((item) => item.type !== 'none')
        .map((item, index) => {
          const key = String(nameKey ?? item.dataKey ?? 'value')
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              // Recharts payload order provides stable legend positions.
              // eslint-disable-next-line @eslint-react/no-array-index-key
              key={index}
              className={cn('flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:text-muted-foreground')}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className='size-2 shrink-0 rounded-xs'
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
    </div>
  )
}

function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) {
    return
  }

  const payloadPayload =
    'payload' in payload && typeof payload.payload === 'object' && payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (key in payload && typeof payload[key as keyof typeof payload] === 'string') {
    configLabelKey = payload[key as keyof typeof payload]
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload]
  }

  return configLabelKey in config ? config[configLabelKey] : config[key]
}
