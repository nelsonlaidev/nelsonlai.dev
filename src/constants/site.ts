export const SITE_GITHUB_URL = 'https://github.com/nelsonlaidev'
export const SITE_FACEBOOK_URL = 'https://www.facebook.com/nelsonlaidev'
export const SITE_INSTAGRAM_URL = 'https://www.instagram.com/nelsonlaidev'
export const SITE_TWITTER_URL = 'https://x.com/nelsonlaidev'
export const SITE_YOUTUBE_URL = 'https://www.youtube.com/@nelsonlaidev'

export const GITHUB_USERNAME = 'nelsonlaidev'
export const TWITTER_USERNAME = 'nelsonlaidev'
export const TWITTER_USER_ID = '1152256803746377730'

export const MY_NAME = 'Nelson Lai'

export const OG_IMAGE_WIDTH = 1200
export const OG_IMAGE_HEIGHT = 630
export const OG_IMAGE_TYPE = 'image/png'

export const AVATAR_MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
export const SUPPORTED_AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export type AvatarMimeType = (typeof SUPPORTED_AVATAR_MIME_TYPES)[number]
