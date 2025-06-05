/**
 * Generate canonical URL for metadata objects
 * @param path - Path relative to domain, e.g., /products/category
 * @returns Object with canonical URL for metadata alternates property
 */
export function getCanonicalUrl(path?: string): { canonical: string } {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com"
  const canonicalPath = path || "/"

  // Strip trailing slashes except for root path
  const normalizedPath =
    canonicalPath === "/" ? canonicalPath : canonicalPath.replace(/\/+$/, "")

  return {
    canonical: normalizedPath,
  }
}

/**
 * Create standard metadata for pages
 * @param title - Page title
 * @param description - Page description
 * @param path - Path for canonical URL
 * @param openGraphImage - Custom OpenGraph image URL (optional)
 * @param keywords - Array of keywords (optional)
 * @returns Metadata object
 */
export function createPageMetadata({
  title,
  description,
  path,
  openGraphImage,
  keywords = [],
}: {
  title: string
  description: string
  path: string
  openGraphImage?: string
  keywords?: string[]
}) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com"

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      ...(openGraphImage && {
        images: [
          {
            url: openGraphImage.startsWith("http")
              ? openGraphImage
              : `${baseUrl}${openGraphImage}`,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    alternates: getCanonicalUrl(path),
  }
}
