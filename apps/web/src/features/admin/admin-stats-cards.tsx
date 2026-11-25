import NumberFlow from '@number-flow/react'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card'
import { useQuery } from '@tanstack/react-query'
import { EyeIcon, HeartIcon, MessageSquareIcon, MessagesSquareIcon, UsersIcon } from 'lucide-react'
import { Skeleton } from 'skullet/react'

import { QueryErrorMessage } from '@/components/query-error-message'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

const STAT_ITEMS = [
  { label: m.admin_dashboard_stats_users, icon: UsersIcon, field: 'totalUsers' },
  { label: m.admin_dashboard_stats_comments, icon: MessagesSquareIcon, field: 'totalComments' },
  { label: m.admin_dashboard_stats_views, icon: EyeIcon, field: 'totalViews' },
  { label: m.admin_dashboard_stats_likes, icon: HeartIcon, field: 'totalLikes' },
  { label: m.admin_dashboard_stats_messages, icon: MessageSquareIcon, field: 'totalMessages' },
] as const

export function AdminStatsCards() {
  const query = useQuery(orpc.admin.stats.queryOptions())

  if (query.isLoadingError) {
    return (
      <QueryErrorMessage
        query={query}
        message={m.error_failed_to_fetch_dashboard_data()}
        className='text-sm text-destructive'
      />
    )
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
      {STAT_ITEMS.map((item) => (
        <Card key={item.field} size='sm'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              {item.label()} <item.icon className='size-4 text-muted-foreground' />
            </CardTitle>
          </CardHeader>
          <CardContent className='text-2xl font-bold'>
            <Skeleton data={query.data?.[item.field]} sample={123} label={m.common_aria_labels_loading()}>
              {(value) => <NumberFlow className='block w-fit rounded-sm' skullet-block='' value={value} />}
            </Skeleton>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
