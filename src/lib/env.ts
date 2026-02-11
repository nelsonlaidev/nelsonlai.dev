import { createEnv } from '@t3-oss/env-nextjs'
import { vercel } from '@t3-oss/env-nextjs/presets-zod'
import * as z from 'zod'

export const env = createEnv({
  extends: [vercel()],

  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    CI: z
      .enum(['true', 'false', '1', '0'])
      .default('false')
      .transform((v) => v === 'true' || v === '1'),
  },

  server: {
    NEXT_RUNTIME: z.enum(['nodejs', 'edge']).default('nodejs'),

    // Required
    DATABASE_URL: z.url(),

    UPSTASH_REDIS_REST_URL: z.url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

    IP_ADDRESS_SALT: z.string().min(1),

    BETTER_AUTH_SECRET: z.string().min(1),

    // Optional
    SPOTIFY_CLIENT_ID: z.string().min(1).optional(),
    SPOTIFY_CLIENT_SECRET: z.string().min(1).optional(),
    SPOTIFY_REFRESH_TOKEN: z.string().min(1).optional(),

    GOOGLE_API_KEY: z.string().min(1).optional(),
    GITHUB_TOKEN: z.string().min(1).optional(),
    WAKATIME_API_KEY: z.string().min(1).optional(),

    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    GITHUB_CLIENT_ID: z.string().min(1).optional(),
    GITHUB_CLIENT_SECRET: z.string().min(1).optional(),

    DISCORD_WEBHOOK_URL: z.url().optional(),

    RESEND_API_KEY: z.string().min(1).optional(),
    AUTHOR_EMAIL: z.email().optional(),
    JWT_SECRET: z.string().min(1).optional(),

    CLOUDFLARE_R2_ENDPOINT: z.url().optional(),
    CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1).optional(),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    CLOUDFLARE_R2_BUCKET_NAME: z.string().min(1).optional(),
    CLOUDFLARE_R2_PUBLIC_URL: z.url().optional(),

    POSTHOG_ENV_ID: z.string().min(1).optional(),
    POSTHOG_API_KEY: z.string().min(1).optional(),
  },

  client: {
    // Required
    NEXT_PUBLIC_SITE_URL: z.url(),

    // Optional
    NEXT_PUBLIC_VERCEL_ENV: z.string().optional(),
    NEXT_PUBLIC_VERCEL_BRANCH_URL: z.string().optional(),

    NEXT_PUBLIC_UMAMI_URL: z.url().optional(),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.uuid().optional(),

    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1).optional(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    CI: process.env.CI,

    NEXT_RUNTIME: process.env.NEXT_RUNTIME,

    DATABASE_URL: process.env.DATABASE_URL,

    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,

    IP_ADDRESS_SALT: process.env.IP_ADDRESS_SALT,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,

    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,

    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    WAKATIME_API_KEY: process.env.WAKATIME_API_KEY,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,

    RESEND_API_KEY: process.env.RESEND_API_KEY,
    AUTHOR_EMAIL: process.env.AUTHOR_EMAIL,
    JWT_SECRET: process.env.JWT_SECRET,

    CLOUDFLARE_R2_ENDPOINT: process.env.CLOUDFLARE_R2_ENDPOINT,
    CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    CLOUDFLARE_R2_BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    CLOUDFLARE_R2_PUBLIC_URL: process.env.CLOUDFLARE_R2_PUBLIC_URL,

    POSTHOG_ENV_ID: process.env.POSTHOG_ENV_ID,
    POSTHOG_API_KEY: process.env.POSTHOG_API_KEY,

    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_VERCEL_BRANCH_URL: process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL,

    NEXT_PUBLIC_UMAMI_URL: process.env.NEXT_PUBLIC_UMAMI_URL,
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,

    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },

  emptyStringAsUndefined: true,
})
