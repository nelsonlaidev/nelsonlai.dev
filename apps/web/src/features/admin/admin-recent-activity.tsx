import type { AdminRecentActivityOutput } from './types'

import { ParaglideMessage } from '@inlang/paraglide-js-react'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card'
import { createRange } from '@repo/utils'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Skeleton } from 'skullet/react'

import { UserAvatar } from '@/components/user-avatar'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

const SAMPLE_ACTIVITIES: AdminRecentActivityOutput['activities'] = createRange(10).map((index) => ({
  type: 'message',
  id: String(index),
  user: { id: 'sample', name: 'Ocean visitor', image: '/images/avatar.png' },
  body: 'A message from a recent visitor.',
  createdAt: new Date('2026-01-01T12:00:00Z'),
}))

export function AdminRecentActivity() {
  const { data, isError } = useQuery(orpc.admin.recentActivity.queryOptions())

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.admin_dashboard_recent_activity_title()}</CardTitle>
      </CardHeader>
      <CardContent>
        {isError && <p className='text-sm text-destructive'>{m.error_failed_to_fetch_dashboard_data()}</p>}
        {(!isError || data) && (
          <Skeleton
            data={data?.activities}
            sample={SAMPLE_ACTIVITIES}
            label={m.common_aria_labels_loading()}
            empty={data?.activities.length === 0}
            emptyMessage={<p className='text-sm text-muted-foreground'>{m.admin_dashboard_recent_activity_empty()}</p>}
          >
            {(activities) => (
              <div className='divide-y'>
                {activities.map((activity) => (
                  <ActivityItem key={`${activity.type}-${activity.id}`} activity={activity} />
                ))}
              </div>
            )}
          </Skeleton>
        )}
      </CardContent>
    </Card>
  )
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
