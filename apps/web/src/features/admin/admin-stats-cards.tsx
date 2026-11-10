import NumberFlow from '@number-flow/react'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card'
import { useQuery } from '@tanstack/react-query'
import { EyeIcon, HeartIcon, MessageSquareIcon, MessagesSquareIcon, UsersIcon } from 'lucide-react'
import { Skeleton } from 'skullet/react'

import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

const STAT_ITEMS = [
  // @i18n-check m.admin_dashboard_stats_users()
  { label: m.admin_dashboard_stats_users, icon: UsersIcon, field: 'totalUsers' },
  // @i18n-check m.admin_dashboard_stats_comments()
  { label: m.admin_dashboard_stats_comments, icon: MessagesSquareIcon, field: 'totalComments' },
  // @i18n-check m.admin_dashboard_stats_views()
  { label: m.admin_dashboard_stats_views, icon: EyeIcon, field: 'totalViews' },
  // @i18n-check m.admin_dashboard_stats_likes()
  { label: m.admin_dashboard_stats_likes, icon: HeartIcon, field: 'totalLikes' },
  // @i18n-check m.admin_dashboard_stats_messages()
  { label: m.admin_dashboard_stats_messages, icon: MessageSquareIcon, field: 'totalMessages' },
] as const

export function AdminStatsCards() {
  const { data, isError } = useQuery(orpc.admin.stats.queryOptions())

  if (isError) {
    return <p className='text-sm text-destructive'>{m.error_failed_to_fetch_dashboard_data()}</p>
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
      {STAT_ITEMS.map((item) => (
        <Card key={item.field} size='sm' className='border shadow-none ring-0'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              {item.label()} <item.icon className='size-4 text-muted-foreground' />
            </CardTitle>
          </CardHeader>
          <CardContent className='text-2xl/normal font-bold'>
            <Skeleton
              className='min-h-lh self-start [--skullet-text-bottom:baseline] [--skullet-text-top:cap-height]'
              data={data?.[item.field]}
              sample={123}
              label={m.common_aria_labels_loading()}
            >
              {(value) => (data ? <NumberFlow className='block' value={value} /> : <span>{value}</span>)}
            </Skeleton>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
