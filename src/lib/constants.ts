import { env } from './env'

export const IS_PRODUCTION = env.NODE_ENV === 'production'

// eslint-disable-next-line unicorn/no-typeof-undefined -- window is not always defined
export const IS_SERVER = typeof globalThis.window === 'undefined'

export const GITHUB_USERNAME = 'nelsonlaidev'

export const MY_NAME = 'Nelson Lai'

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_IMAGE_TYPE = 'image/png'

export const AVATAR_MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
export const SUPPORTED_AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export type AvatarMimeType = (typeof SUPPORTED_AVATAR_MIME_TYPES)[number]
