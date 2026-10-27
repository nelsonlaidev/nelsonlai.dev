import { S3Client } from '@aws-sdk/client-s3'
import { ORPCError } from '@orpc/server'

import { ENV } from '../env'

let client: S3Client | undefined

export function getCloudflareR2() {
  const endpoint = ENV.CLOUDFLARE_R2_ENDPOINT
  const accessKeyId = ENV.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = ENV.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  const bucketName = ENV.CLOUDFLARE_R2_BUCKET_NAME
  const publicUrl = ENV.CLOUDFLARE_R2_PUBLIC_URL

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    throw new ORPCError('SERVICE_UNAVAILABLE', { message: 'Avatar storage is not configured.' })
  }

  client ??= new S3Client({
    region: 'auto',
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  })

  return { client, bucketName, publicUrl: publicUrl.replace(/\/$/, '') }
}
