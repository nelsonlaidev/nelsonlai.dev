import type { AccountSession } from './types'

import { Badge } from '@repo/ui/components/badge'
import { Button } from '@repo/ui/components/button'
import { Card, CardContent } from '@repo/ui/components/card'
import { InfoTip } from '@repo/ui/components/info-tip'
import { Spinner } from '@repo/ui/components/spinner'
import { toast } from '@repo/ui/components/toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Bowser from 'bowser'
import { BotIcon, InfoIcon, MonitorIcon, SmartphoneIcon, TabletIcon, TvIcon } from 'lucide-react'

import { useSessionEnded } from '@/features/auth/use-session-ended'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { orpc } from '@/lib/orpc-client'
import { m } from '@/paraglide/messages'

import { accountSessionsQueryOptions } from './account.queries'
import { ActiveSessionsSkeleton } from './active-sessions-skeleton'

type ActiveSessionsProps = {
  userId: string
}

export function ActiveSessions(props: ActiveSessionsProps) {
  const { userId } = props
  const queryClient = useQueryClient()
  const reconcileSessionEnded = useSessionEnded()
  const options = accountSessionsQueryOptions(userId)
  const sessions = useQuery(options)
  const revoke = useMutation(
    orpc.account.revokeSession.mutationOptions({
      onSuccess: async ({ isCurrentSession }) => {
        toast.add({ type: 'success', title: m.success_session_revoked() })
        await (isCurrentSession
          ? reconcileSessionEnded()
          : queryClient.invalidateQueries({ queryKey: options.queryKey }))
      },
      onError: () => toast.add({ type: 'error', title: m.error_something_went_wrong() }),
    }),
  )

  let content: React.ReactNode = <ActiveSessionsSkeleton />

  if (sessions.data && sessions.data.length > 0) {
    content = (
      <div className='space-y-4'>
        {sessions.data.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            isRevoking={revoke.isPending && revoke.variables.id === session.id}
            disabled={revoke.isPending}
            onRevoke={() => {
              if (!revoke.isPending) revoke.mutate({ id: session.id })
            }}
          />
        ))}
      </div>
    )
  } else if (sessions.data) {
    content = <Card className='border py-12 text-center shadow-none ring-0'>{m.account_no_active_sessions()}</Card>
  } else if (sessions.isError) {
    content = null
  }

  return (
    <section className='space-y-6' aria-labelledby='sessions-heading' aria-busy={sessions.isPending}>
      <h2 id='sessions-heading' className='text-xl/[calc(1.75/1.125)] font-[450] tracking-tight'>
        {m.account_active_sessions()}
      </h2>
      {sessions.isError && <p role='alert'>{m.error_something_went_wrong()}</p>}
      {content}
    </section>
  )
}

const PLATFORM_ICONS: Record<string, typeof MonitorIcon | undefined> = {
  bot: BotIcon,
  desktop: MonitorIcon,
  mobile: SmartphoneIcon,
  tablet: TabletIcon,
  tv: TvIcon,
}

type SessionCardProps = {
  session: AccountSession
  isRevoking: boolean
  disabled: boolean
  onRevoke: () => void
}

function SessionCard(props: SessionCardProps) {
  const { session, isRevoking, disabled, onRevoke } = props
  const parsed = session.userAgent ? Bowser.parse(session.userAgent) : undefined
  const PlatformIcon = PLATFORM_ICONS[parsed?.platform.type ?? 'desktop'] ?? MonitorIcon
  const lastActive = useFormattedDate(session.updatedAt, { formatName: 'long' })

  return (
    <Card className='border shadow-none ring-0'>
      <CardContent className='flex flex-col justify-between gap-4 wrap-anywhere sm:flex-row sm:items-start'>
        <div className='flex min-w-0 gap-4'>
          <div className='hidden size-12 shrink-0 items-center justify-center rounded-full bg-secondary md:flex'>
            <PlatformIcon aria-hidden='true' className='size-6' />
          </div>
          <div className='min-w-0 space-y-2'>
            <div className='flex flex-wrap items-center gap-2'>
              <h3 className='text-lg font-semibold'>{parsed?.os.name ?? m.common_unknown()}</h3>
              {session.isCurrentSession && <Badge>{m.account_this_device()}</Badge>}
            </div>
            <div className='space-y-1 text-sm'>
              <p>
                {parsed?.browser.name ?? m.common_unknown()}{' '}
                {parsed?.browser.version && <span className='text-muted-foreground'>v{parsed.browser.version}</span>}
              </p>
              <div className='flex flex-wrap items-center gap-1.5 wrap-break-word'>
                {session.ipAddress ?? m.common_unknown()}{' '}
                {session.location && (
                  <div className='flex items-center gap-2'>
                    <span className='text-muted-foreground'>{session.location}</span>
                    <InfoTip label={m.account_location_not_accurate()} content={m.account_location_not_accurate()}>
                      <InfoIcon className='size-4 text-muted-foreground' aria-hidden='true' />
                    </InfoTip>
                  </div>
                )}
              </div>
              <p>{lastActive ?? '--'}</p>
            </div>
          </div>
        </div>
        <Button variant='destructive' size='sm' onClick={onRevoke} disabled={disabled}>
          {isRevoking && <Spinner />}
          {m.account_revoke_session()}
        </Button>
      </CardContent>
    </Card>
  )
}
