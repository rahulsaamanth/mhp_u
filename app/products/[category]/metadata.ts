import { Metadata } from "next"
import { getCategory } from "@/actions/products"

type Props = {
  params: { category: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Get category information
  const categorySlug = params.category
  const categoryData = await getCategory(categorySlug)

  // Format the category name for better readability
  const categoryName =
    categoryData?.name ||
    categorySlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

  const description =
    categoryData?.description ||
    `Browse our collection of ${categoryName} homeopathic medicines and remedies. Find premium quality natural treatments for various health conditions.`

  return {
    title: `${categoryName} Homeopathic Medicines`,
    description,
    keywords: [
      categoryName,
      "homeopathic medicines",
      "natural remedies",
      "homeopathy products",
      "buy homeopathic medicines online",
    ],
    openGraph: {
      title: `${categoryName} Homeopathic Medicines | HomeoSouth`,
      description,
      url: `/products/${categorySlug}`,
      type: "website",
    },
    alternates: {
      canonical: `/products/${categorySlug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
