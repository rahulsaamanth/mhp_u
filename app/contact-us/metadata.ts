import { Metadata } from "next"
import { createPageMetadata } from "@/lib/metadata-utils"

export const metadata: Metadata = createPageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with HomeoSouth for inquiries about our homeopathic products, orders, or any questions you may have. We're here to help!",
  path: "/contact-us",
  keywords: [
    "contact HomeoSouth",
    "homeopathy help",
    "customer support",
    "homeopathic medicine inquiry",
  ],
})
