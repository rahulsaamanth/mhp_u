/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com",
  generateRobotsTxt: true, // We already have a custom robots.txt, so we'll set this to false
  sitemapSize: 7000,
  exclude: [
    "/login",
    "/checkout",
    "/profile",
    "/verify-request",
    "/api/*",
    "/order-confirmation/*",
    "/404",
    "/500",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/login",
          "/checkout",
          "/profile",
          "/verify-request",
          "/api/",
        ],
      },
    ],
    additionalSitemaps: [
      `${
        process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com"
      }/server-sitemap.xml`,
    ],
  },
  // Set priority for important pages
  transform: async (config, path) => {
    // Custom priority for important pages
    let priority = 0.7

    if (path === "/") {
      priority = 1.0
    } else if (path.startsWith("/product/")) {
      priority = 0.8
    } else if (path.startsWith("/products/")) {
      priority = 0.9
    } else if (
      path.startsWith("/about-homeopathy") ||
      path.startsWith("/brands") ||
      path.startsWith("/ailments")
    ) {
      priority = 0.8
    }

    // Default change frequency
    let changefreq = "weekly"

    if (path === "/") {
      changefreq = "daily"
    } else if (path.startsWith("/products/")) {
      changefreq = "daily"
    } else if (path.startsWith("/product/")) {
      changefreq = "weekly"
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}
