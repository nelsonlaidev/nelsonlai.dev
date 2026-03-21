'use client'

import type { SessionListOutput } from '@/orpc/client'

import Bowser from 'bowser'
import { BotIcon, InfoIcon, MonitorIcon, SmartphoneIcon, TabletIcon, TvIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tip } from '@/components/ui/tip'
import { useListSessions, useRevokeSession } from '@/hooks/queries/auth.query'
import { useFormattedDate } from '@/hooks/use-formatted-date'
import { useRouter } from '@/i18n/routing'
import { useSession } from '@/lib/auth-client'

import { ActiveSessionsSkeleton } from './active-sessions-skeleton'

export function ActiveSessions() {
  const t = useTranslations()
  const { data, isSuccess, isLoading, isError } = useListSessions()

  const sortedSessions =
    isSuccess &&
    data.sessions.length > 0 &&
    data.sessions.toSorted((a, b) => {
      if (a.isCurrentSession !== b.isCurrentSession) {
        return a.isCurrentSession ? -1 : 1
      }
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    })

  return (
    <div className='space-y-6'>
      <h2 className='text-lg font-semibold'>{t('account.active-sessions')}</h2>
      {isLoading && <ActiveSessionsSkeleton />}
      {isError && <div>{t('error.something-went-wrong')}</div>}
      {sortedSessions && (
        <div className='space-y-4'>
          {sortedSessions.map((session) => (
            <Session key={session.id} session={session} />
          ))}
        </div>
      )}
      {sortedSessions && sortedSessions.length === 0 && (
        <Card className='py-12 text-center'>{t('account.no-active-sessions')}</Card>
      )}
    </div>
  )
}

type SessionProps = {
  session: SessionListOutput['sessions'][number]
}

const PLATFORM_ICONS = {
  bot: BotIcon,
  desktop: MonitorIcon,
  mobile: SmartphoneIcon,
  tablet: TabletIcon,
  tv: TvIcon,
}

function Session(props: SessionProps) {
  const { session } = props
  const t = useTranslations()
  const { refetch: refetchSession } = useSession()
  const router = useRouter()

  const { browser, os, platform } = Bowser.parse(session.userAgent ?? '')

  const platformType = (platform.type ?? 'desktop') as keyof typeof PLATFORM_ICONS
  const PlatformIcon = PLATFORM_ICONS[platformType]

  const browserName = browser.name ?? t('common.unknown')
  const browserVersion = browser.version ? `v${browser.version}` : ''
  const osName = os.name ?? t('common.unknown')

  const ipAddress = session.ipAddress ?? t('common.unknown')
  const lastActive = useFormattedDate(session.createdAt, { formatName: 'long' })

  const { mutate: revokeSession, isPending: isRevoking } = useRevokeSession(() => {
    toast.success(t('success.session-revoked'))
    if (session.isCurrentSession) {
      router.push('/')
      void refetchSession()
    }
  })

  function handleRevoke() {
    if (isRevoking) return
    revokeSession({ token: session.token })
  }

  return (
    <Card>
      <CardContent className='flex flex-col gap-4 sm:flex-row sm:justify-between'>
        <div className='flex gap-4'>
          <div className='hidden size-12 shrink-0 items-center justify-center rounded-full bg-secondary md:flex'>
            <PlatformIcon aria-hidden className='size-6' />
          </div>
          <div className='space-y-1'>
            <div className='flex items-center gap-2 font-semibold'>
              <span className='text-lg'>{osName}</span>{' '}
              {session.isCurrentSession && <Badge>{t('account.this-device')}</Badge>}
            </div>
            <div className='space-y-1 text-sm'>
              <div>
                {browserName} {browserVersion && <span className='text-muted-foreground'>{browserVersion}</span>}
              </div>
              <div className='flex flex-wrap items-center gap-1.5'>
                {ipAddress}{' '}
                {session.location && (
                  <div className='flex items-center gap-2'>
                    <span className='text-muted-foreground'>{session.location}</span>
                    <Tip content={t('account.location-not-accurate')}>
                      <InfoIcon className='size-4 text-muted-foreground' />
                    </Tip>
                  </div>
                )}
              </div>
              <div>{lastActive ?? '--'}</div>
            </div>
          </div>
        </div>
        <Button variant='destructive' size='sm' onClick={handleRevoke} disabled={isRevoking}>
          {t('account.revoke-session')}
        </Button>
      </CardContent>
    </Card>
  )
}
