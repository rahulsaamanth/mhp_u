import { Metadata } from "next"
import { getProduct } from "@/actions/products"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch product data
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    }
  }

  // Extract product details for metadata
  const { name, description, brand, category } = product

  // Prepare structured data for the product
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description:
      description ||
      `${name} - Homeopathic medicine by ${brand?.name || "HomeoSouth"}`,
    brand: {
      "@type": "Brand",
      name: brand?.name || "HomeoSouth",
    },
    category: category?.name,
    offers: {
      "@type": "Offer",
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      price: product.sale_price || product.price,
      priceCurrency: "INR",
    },
    image: product.image_url || "/placeholder.png",
  }

  return {
    title: `${name} | ${brand?.name || "Homeopathic Medicine"}`,
    description:
      description ||
      `Buy ${name} homeopathic medicine online from HomeoSouth. Premium quality homeopathic remedy for natural treatment.`,
    keywords: [
      name,
      brand?.name || "homeopathic medicine",
      category?.name || "homeopathy",
      "natural remedy",
      "homeopathy",
    ],
    openGraph: {
      title: `${name} | HomeoSouth`,
      description:
        description ||
        `Buy ${name} homeopathic medicine online from HomeoSouth. Premium quality homeopathic remedy for natural treatment.`,
      url: `/product/${params.id}`,
      type: "website",
      images: [
        {
          url: product.image_url || "/placeholder.png",
          width: 800,
          height: 600,
          alt: name,
        },
      ],
    },
    alternates: {
      canonical: `/product/${params.id}`,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      price: `${product.sale_price || product.price}`,
      currency: "INR",
    },
    // Add structured data for the product
    twitter: {
      card: "summary_large_image",
      title: `${name} | Homeopathic Medicine`,
      description:
        description ||
        `Buy ${name} homeopathic medicine online from HomeoSouth.`,
      images: [product.image_url || "/placeholder.png"],
    },
  }
}
