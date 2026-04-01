export const POSTHOG_FEATURE_FLAGS = {
  analyticsClientEvents: 'analytics_client_events_v1',
} as const

export type PostHogFeatureFlag = (typeof POSTHOG_FEATURE_FLAGS)[keyof typeof POSTHOG_FEATURE_FLAGS]
