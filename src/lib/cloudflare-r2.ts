import 'server-only'

import { S3Client } from '@aws-sdk/client-s3'

import { ENV } from '@/env'

type R2Client = {
  client: S3Client
  bucketName: string
  publicUrl: string
}

function createClient(): R2Client {
  const endpoint = ENV.CLOUDFLARE_R2_ENDPOINT
  const accessKeyId = ENV.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = ENV.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  const bucketName = ENV.CLOUDFLARE_R2_BUCKET_NAME
  const publicUrl = ENV.CLOUDFLARE_R2_PUBLIC_URL

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    throw new Error('Missing Cloudflare R2 environment variables')
  }

  const client = new S3Client({
    region: 'auto',
    endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })

  return {
    client,
    bucketName,
    publicUrl,
  }
}

let r2Client: R2Client | undefined

export function getCloudflareR2() {
  r2Client ??= createClient()
  return r2Client
}
