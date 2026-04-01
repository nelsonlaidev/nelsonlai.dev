export const POSTHOG_EVENT_VERSION = 1

export const POSTHOG_EVENTS = {
  contentPostViewed: 'content.post_viewed',
  contentPostLiked: 'content.post_liked',
  contentCommentCreated: 'content.comment_created',
  contentReplyCreated: 'content.reply_created',
  contentCommentDeleted: 'content.comment_deleted',
  guestbookMessageCreated: 'guestbook.message_created',
  guestbookMessageDeleted: 'guestbook.message_deleted',
  accountSessionRevoked: 'account.session_revoked',
  accountProfileUpdated: 'account.profile_updated',
  accountSettingsUpdated: 'account.settings_updated',
  authSignInStarted: 'auth.sign_in_started',
  authSignInFailed: 'auth.sign_in_failed',
  authSignOutSucceeded: 'auth.sign_out_succeeded',
  uiSignInDialogOpened: 'ui.sign_in_dialog_opened',
} as const

export type PostHogEventName = (typeof POSTHOG_EVENTS)[keyof typeof POSTHOG_EVENTS]
export type AnalyticsSource = 'frontend' | 'backend'
export type ViewerType = 'anonymous' | 'authenticated'

export type BaseEventProperties = {
  event_version: typeof POSTHOG_EVENT_VERSION
  event_source: AnalyticsSource
  is_authenticated: boolean
  pathname?: string
  locale?: string
  user_role?: string
}

export type PostHogEventPropertiesMap = {
  [POSTHOG_EVENTS.contentPostViewed]: {
    post_slug: string
    viewer_type: ViewerType
  }
  [POSTHOG_EVENTS.contentPostLiked]: {
    post_slug: string
    increment_value: number
    current_user_like_count: number
    viewer_type: ViewerType
  }
  [POSTHOG_EVENTS.contentCommentCreated]: {
    post_slug: string
    comment_id: string
    content_length: number
  }
  [POSTHOG_EVENTS.contentReplyCreated]: {
    post_slug: string
    comment_id: string
    parent_comment_id: string
    content_length: number
  }
  [POSTHOG_EVENTS.contentCommentDeleted]: {
    comment_id: string
    post_slug: string
    had_replies: boolean
    was_reply: boolean
  }
  [POSTHOG_EVENTS.guestbookMessageCreated]: {
    message_id: string
    content_length: number
  }
  [POSTHOG_EVENTS.guestbookMessageDeleted]: {
    message_id: string
  }
  [POSTHOG_EVENTS.accountSessionRevoked]: {
    revoked_session_is_current: boolean
    had_location: boolean
    device_type: string
  }
  [POSTHOG_EVENTS.accountProfileUpdated]: {
    updated_fields: string[]
  }
  [POSTHOG_EVENTS.accountSettingsUpdated]: {
    reply_notifications_enabled: boolean
  }
  [POSTHOG_EVENTS.authSignInStarted]: {
    provider: 'github' | 'google'
  }
  [POSTHOG_EVENTS.authSignInFailed]: {
    provider: 'github' | 'google'
    error_kind: string
  }
  [POSTHOG_EVENTS.authSignOutSucceeded]: Record<string, never>
  [POSTHOG_EVENTS.uiSignInDialogOpened]: Record<string, never>
}

export type EventProperties<TEvent extends PostHogEventName> = PostHogEventPropertiesMap[TEvent]
