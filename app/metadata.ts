import { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com"
  ),
  title: {
    default: "Homeo South - Buy Homeopathic Medicines Online",
    template: "%s | Homeo South",
  },
  description:
    "Premium quality homeopathic remedies from India. Shop natural, effective treatments for various health conditions with 100% authentic medicines.",
  keywords: [
    "homeopathic medicines",
    "homeopathy",
    "natural remedies",
    "online homeopathy store",
    "buy homeopathic medicines",
    "Homeo South",
  ],
  authors: [
    {
      name: "Homeo South",
    },
  ],
  creator: "Homeo South",
  publisher: "Homeo South",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Homeo South - Buy Homeopathic Medicines Online",
    description:
      "Premium quality homeopathic remedies from India. Shop natural, effective treatments for various health conditions.",
    siteName: "Homeo South",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "Homeo South",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Homeo South - Buy Homeopathic Medicines Online",
    description:
      "Premium quality homeopathic remedies from India. Shop natural, effective treatments for various health conditions.",
    creator: "@homeosouth",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
}
