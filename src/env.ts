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

  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    CI: process.env.CI,

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
