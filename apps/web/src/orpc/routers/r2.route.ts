import type { AvatarMimeType } from '@/lib/constants'

import { randomUUID } from 'node:crypto'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { ORPCError } from '@orpc/client'

import { getCloudflareR2 } from '@/lib/cloudflare-r2'
import { getR2PublicUrl } from '@/utils/get-r2-public-url'

import { protectedProcedure } from '../root'
import { getAvatarUploadUrlInputSchema, getAvatarUploadUrlOutputSchema } from '../schemas/r2.schema'

export const getAvatarUploadUrl = protectedProcedure
  .input(getAvatarUploadUrlInputSchema)
  .output(getAvatarUploadUrlOutputSchema)
  .handler(async ({ input, context }) => {
    const r2 = getCloudflareR2()

    if (!r2) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'R2 storage is not configured'
      })
    }

    const { client, bucketName, publicUrl } = r2

    const extensionMap: Record<AvatarMimeType, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp'
    }

    const extension = extensionMap[input.fileType]

    const path = `avatars/${context.session.user.id}/${randomUUID()}.${extension}`

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: path,
      ContentType: input.fileType
    })

    const uploadUrl = await getSignedUrl(client, command, {
      expiresIn: 60 * 5
    })

    return {
      uploadUrl,
      publicUrl: getR2PublicUrl(publicUrl, path),
      key: path
    }
  })
