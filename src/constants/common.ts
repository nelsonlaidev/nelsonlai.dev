import { ENV } from '@/env'

export const IS_PRODUCTION = ENV.NODE_ENV === 'production'

// window is not always defined
// oxlint-disable-next-line unicorn/no-typeof-undefined
export const IS_SERVER = typeof globalThis.window === 'undefined'

export const DEFAULT_PAGE_SIZE = 10
