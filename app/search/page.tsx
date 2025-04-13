"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ProductCard, { ProductCardProps } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { discountType } from "@rahulsaamanth/mhp-schema"

// Updated to match ProductCardProps interface
interface Product {
  id: string
  name: string
  form: string
  unit: string
  image: string[]
  mrp: number
  sellingPrice: number
  discountType: (typeof discountType.enumValues)[number]
  discount: number
  potencies: string[]
  packSizes: string[]
  // Optional fields for display purposes
  category?: string
  manufacturer?: string
  description?: string
  variants?: any[]
}

// Response from search API
interface SearchResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const pageParam = searchParams.get("page") || "1"

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(parseInt(pageParam))

  useEffect(() => {
    async function fetchSearchResults() {
      setLoading(true)

      const queryParams = new URLSearchParams()
      if (query) queryParams.append("q", query)
      queryParams.append("page", currentPage.toString())

      try {
        const response = await fetch(`/api/search?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch search results")
        }

        const data: SearchResponse = await response.json()
        console.log(data)

        // Transform API response to match expected Product interface
        const transformedProducts: Product[] = data.products.map((product) => {
          // Find the first variant with a non-empty variantImage array, or use placeholder if none found
          const image = product.variants?.find(
            (v) => v.variantImage && v.variantImage.length > 0
          )?.variantImage || ["https://placehold.co/600x400?text=No+Image"]

          const uniquePackSizes = [
            ...new Set(
              product.variants
                ?.map((v) => v.packSize?.toString())
                .filter(Boolean) || []
            ),
          ]
          const uniquePotencies = [
            ...new Set(
              product.variants?.map((v) => v.potency).filter(Boolean) || []
            ),
          ]

          return {
            id: product.id,
            name: product.name,
            form: product.form || "NONE",
            unit: product.unit || "NONE",
            image: image,
            mrp: product.variants?.[0]?.mrp || 0,
            sellingPrice: product.variants?.[0]?.sellingPrice || 0,
            discountType: product.variants?.[0]?.discountType || "PERCENTAGE",
            discount: product.variants?.[0]?.discount || 0,
            potencies: uniquePotencies,
            packSizes: uniquePackSizes,
            category: product.category,
            manufacturer: product.manufacturer,
            description: product.description,
            variants: product.variants,
          }
        })

        setProducts(transformedProducts)
        setTotalPages(data.totalPages || 1)
      } catch (error) {
        console.error("Error fetching search results:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query, currentPage])

  console.log(products)

  const handlePaginationChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Search results for "${query}"` : "All Products"}
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePaginationChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <Button
                  key={idx}
                  variant={currentPage === idx + 1 ? "default" : "outline"}
                  onClick={() => handlePaginationChange(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}

              <Button
                variant="outline"
                onClick={() => handlePaginationChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">
            No products found matching your search.
          </p>
        </div>
      )}
    </div>
  )
}
