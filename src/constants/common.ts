import { env } from '../env'

export const IS_PRODUCTION = env.NODE_ENV === 'production'
export const IS_TEST = env.NODE_ENV === 'test'

// window is not always defined
// eslint-disable-next-line unicorn/no-typeof-undefined
export const IS_SERVER = typeof globalThis.window === 'undefined'
