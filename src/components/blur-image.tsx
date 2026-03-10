// Based on delbaoliveira/website
// Copyright (c) Delba de Oliveira
// Source: https://github.com/delbaoliveira/website/blob/59e6f181ad75751342ceaa8931db4cbcef86b018/ui/BlurImage.tsx
//
// Modified by: Nelson Lai
'use client'

import NextImage from 'next/image'
import { useState } from 'react'

import { cn } from '@/utils/cn'

type ImageProps = {
  imageClassName?: string
  lazy?: boolean
} & React.ComponentProps<typeof NextImage>

export function BlurImage(props: ImageProps) {
  const { alt, src, className, imageClassName, lazy = true, ...rest } = props
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div data-loading={isLoading} className={cn('group overflow-hidden data-[loading=true]:animate-pulse', className)}>
      <NextImage
        className={cn(
          'group-data-[loading=true]:scale-[1.02] group-data-[loading=true]:blur-xl group-data-[loading=true]:grayscale',
          imageClassName,
        )}
        style={{
          transition: 'filter 700ms ease, scale 150ms ease',
        }}
        src={src}
        alt={alt}
        loading={lazy ? 'lazy' : undefined}
        priority={!lazy}
        quality={100}
        onLoad={() => {
          setIsLoading(false)
        }}
        {...rest}
      />
    </div>
  )
}
