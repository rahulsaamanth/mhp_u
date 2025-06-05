import { Metadata } from "next"
import { createPageMetadata } from "@/lib/metadata-utils"

export const metadata: Metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Read HomeoSouth's privacy policy to understand how we collect, use, and protect your personal information when you visit our website or purchase products.",
  path: "/privacy-policy",
  keywords: [
    "privacy policy",
    "data protection",
    "homeopathy website privacy",
    "personal information policy",
  ],
})
