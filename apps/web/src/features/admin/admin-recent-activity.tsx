import type { AdminRecentActivityOutput } from './types'

import { ParaglideMessage } from '@inlang/paraglide-js-react'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card'
import { Skeleton } from '@repo/ui/components/skeleton'
import { createRange } from '@repo/utils'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { UserAvatar } from '@/components/user-avatar'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

export function AdminRecentActivity() {
  const { data, isError } = useQuery(orpc.admin.recentActivity.queryOptions())

  let content: React.ReactNode = <RecentActivitySkeleton />

  if (data && data.activities.length > 0) {
    content = data.activities.map((activity) => (
      <ActivityItem key={`${activity.type}-${activity.id}`} activity={activity} />
    ))
  } else if (data) {
    content = <p className='text-sm text-muted-foreground'>{m.admin_dashboard_recent_activity_empty()}</p>
  } else if (isError) {
    content = null
  }

  return (
    <Card className='border shadow-none ring-0'>
      <CardHeader>
        <CardTitle>{m.admin_dashboard_recent_activity_title()}</CardTitle>
      </CardHeader>
      <CardContent className='divide-y'>
        {isError && <p className='text-sm text-destructive'>{m.error_failed_to_fetch_dashboard_data()}</p>}
        {content}
      </CardContent>
    </Card>
  )
}

function RecentActivitySkeleton() {
  return createRange(10).map((number) => (
    <div key={number} className='flex items-start gap-3 py-3'>
      <Skeleton className='size-6 rounded-full' />
      <div className='flex-1 space-y-2'>
        <Skeleton className='h-5 w-3/4' />
        <Skeleton className='h-4 w-1/2' />
        <Skeleton className='h-4 w-1/4' />
      </div>
    </div>
  ))
}

type ActivityProps = {
  activity: AdminRecentActivityOutput['activities'][number]
}

function ActivityItem(props: ActivityProps) {
  const { activity } = props

  const userName = activity.user.name
  const timeAgo = useFormattedDate(activity.createdAt, { relative: true, threshold: 30 })

  return (
    <div className='flex items-start gap-3 py-3'>
      <UserAvatar id={activity.user.id} name={userName} image={activity.user.image} className='size-6' />
      <div className='min-w-0 flex-1 space-y-1 wrap-anywhere'>
        <p className='text-sm'>
          {activity.type === 'comment' ? (
            <ParaglideMessage
              message={m.admin_dashboard_recent_activity_commented_on}
              inputs={{ name: userName, post: activity.postId }}
              markup={{
                link: (props) => (
                  <Link to='/blog/$slug' params={{ slug: activity.postId }} className='underline underline-offset-4'>
                    {props.children}
                  </Link>
                ),
              }}
            />
          ) : (
            m.admin_dashboard_recent_activity_guestbook_message({
              name: userName,
            })
          )}
        </p>
        <p className='line-clamp-1 text-sm text-muted-foreground'>{activity.body}</p>
        <p className='text-sm text-muted-foreground'>{timeAgo}</p>
      </div>
    </div>
  )
}
