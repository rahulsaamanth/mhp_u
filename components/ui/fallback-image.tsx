"use client"

import { useState } from "react"
import Image, { ImageProps } from "next/image"

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc: string
}

export default function FallbackImage({
  src,
  fallbackSrc,
  alt,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    typeof src === "string" ? src : fallbackSrc
  )

  const handleError = () => {
    setImgSrc(fallbackSrc)
  }

  return (
    <Image
      {...props}
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={handleError}
    />
  )
}
