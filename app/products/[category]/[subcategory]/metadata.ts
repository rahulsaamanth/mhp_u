import { Metadata } from "next"
import { getSubcategory } from "@/actions/products"

type Props = {
  params: { category: string; subcategory: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Get subcategory information
  const { category: categorySlug, subcategory: subcategorySlug } = params
  const subcategoryData = await getSubcategory(
    categorySlug,
    subcategorySlug
  )

  // Format the category and subcategory names for better readability
  const categoryName = categorySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
  const subcategoryName =
    subcategoryData?.name ||
    subcategorySlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

  const description =
    subcategoryData?.description ||
    `Browse our collection of ${subcategoryName} homeopathic medicines and remedies in the ${categoryName} category. Find premium quality natural treatments for various health conditions.`

  return {
    title: `${subcategoryName} - ${categoryName} Homeopathic Medicines`,
    description,
    keywords: [
      subcategoryName,
      categoryName,
      "homeopathic medicines",
      "natural remedies",
      "homeopathy products",
      "buy homeopathic medicines online",
    ],
    openGraph: {
      title: `${subcategoryName} - ${categoryName} Homeopathic Medicines | HomeoSouth`,
      description,
      url: `/products/${categorySlug}/${subcategorySlug}`,
      type: "website",
    },
    alternates: {
      canonical: `/products/${categorySlug}/${subcategorySlug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}
