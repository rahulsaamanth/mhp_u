import React from "react"
import Head from "next/head"

interface CanonicalProps {
  path?: string // Path relative to domain, e.g., /products/category
}

/**
 * Component for adding canonical URL to pages.
 * Creates a canonical URL based on the current path or a provided path.
 */
export default function Canonical({ path }: CanonicalProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com"
  const canonicalUrl = path ? `${baseUrl}${path}` : baseUrl

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
    </Head>
  )
}
