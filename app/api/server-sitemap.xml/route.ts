import { getAllProducts, getAllCategories, getAllBrands, getAllAilments } from "@/actions/products"
import { getServerSideSitemap, ISitemapField } from "next-sitemap"
import { MetadataRoute } from "next"

// Define interfaces for the expected data structures
interface Product {
  id: string
  // Add other fields as needed
}

interface Category {
  slug: string
  // Add other fields as needed
}

interface Brand {
  slug: string
  // Add other fields as needed
}

interface Ailment {
  slug: string
  // Add other fields as needed
}

// Valid values for changefreq according to next-sitemap
type Changefreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never"

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homeosouth.com"

  try {
    // Fetch all products, categories, and brands
    const allProducts = (await getAllProducts()) as Product[]
    const allCategories = (await getAllCategories()) as Category[]
    const allBrands = (await getAllBrands()) as Brand[]
    const allAilments = (await getAllAilments()) as Ailment[]

    // Create entries for products
    const productEntries = allProducts.map((product: Product) => ({
      loc: `${baseUrl}/product/${product.id}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly" as Changefreq,
      priority: 0.8,
    }))

    // Create entries for categories
    const categoryEntries = allCategories.map((category: Category) => ({
      loc: `${baseUrl}/products/${category.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "daily" as Changefreq,
      priority: 0.9,
    }))

    // Create entries for brands
    const brandEntries = allBrands.map((brand: Brand) => ({
      loc: `${baseUrl}/brands/${brand.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly" as Changefreq,
      priority: 0.7,
    }))

    // Create entries for ailments
    const ailmentEntries = allAilments.map((ailment: Ailment) => ({
      loc: `${baseUrl}/ailments/${ailment.slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly" as Changefreq,
      priority: 0.7,
    }))

    // Combine all entries
    const allEntries: ISitemapField[] = [
      ...productEntries,
      ...categoryEntries,
      ...brandEntries,
      ...ailmentEntries,
    ]

    return getServerSideSitemap(allEntries)
  } catch (error) {
    console.error("Error generating server sitemap:", error)
    return new Response("Error generating sitemap", { status: 500 })
  }
}
