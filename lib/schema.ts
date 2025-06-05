import { getProduct } from "@/actions/products"

// Function to create organization schema
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "HomeoSouth",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com",
    logo: `${
      process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com"
    }/logo.png`,
    sameAs: [
      "https://www.facebook.com/homeosouth",
      "https://www.instagram.com/homeosouth",
      "https://twitter.com/homeosouth",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-XXXXXXXXXX",
      contactType: "customer service",
      availableLanguage: ["English", "Hindi"],
    },
  }
}

// Function to create breadcrumb schema
export function generateBreadcrumbSchema(
  items: Array<{ name: string; item: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com"}${
        item.item
      }`,
    })),
  }
}

// Function to create product schema
export async function generateProductSchema(productId: string) {
  const product = await getProduct(productId)

  if (!product) {
    return null
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image:
      product.image_url ||
      `${
        process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com"
      }/placeholder.png`,
    description:
      product.description ||
      `${product.name} - Homeopathic medicine by ${
        product.brand?.name || "HomeoSouth"
      }`,
    brand: {
      "@type": "Brand",
      name: product.brand?.name || "HomeoSouth",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.sale_price || product.price,
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${
        process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com"
      }/product/${product.id}`,
    },
    category: product.category?.name,
  }
}

// Function to create FAQ schema
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

// Function to create local business schema
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "HomeoSouth",
    image: `${
      process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com"
    }/logo.png`,
    "@id": `${
      process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com"
    }/#store`,
    url: process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com",
    telephone: "+91-XXXXXXXXXX",
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Main Street",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 12.9716,
      longitude: 77.5946,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "10:00",
        closes: "17:00",
      },
    ],
    sameAs: [
      "https://www.facebook.com/homeosouth",
      "https://www.instagram.com/homeosouth",
      "https://twitter.com/homeosouth",
    ],
  }
}
