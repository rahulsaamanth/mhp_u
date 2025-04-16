"use client"

import { parseAsInteger, useQueryState } from "nuqs"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import ProductCard, { ProductCardProps } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { discountType } from "@rahulsaamanth/mhp-schema"

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
  category?: string
  manufacturer?: string
  description?: string
  variants?: any[]
}

interface SearchResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function SearchPage() {
  const [query, setQuery] = useQueryState("q")
  const [category, setCategory] = useQueryState("category")
  const [manufacturer, setManufacturer] = useQueryState("manufacturer")
  const [potency, setPotency] = useQueryState("potency")
  const [form, setForm] = useQueryState("form")
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(12)
  )

  const searchQuery = useQuery({
    queryKey: [
      "products",
      "search",
      { query, category, manufacturer, potency, form, page, limit },
    ],
    queryFn: async () => {
      const searchParams = new URLSearchParams()
      if (query) searchParams.set("q", query)
      if (category) searchParams.set("category", category)
      if (manufacturer) searchParams.set("manufacturer", manufacturer)
      if (potency) searchParams.set("potency", potency)
      if (form) searchParams.set("form", form)
      searchParams.set("page", page.toString())
      searchParams.set("limit", limit.toString())

      const response = await fetch(`/api/search?${searchParams.toString()}`)
      if (!response.ok) throw new Error("Search failed")

      const data = await response.json()

      interface ApiVariant {
        variantImage?: string[]
        packSize?: string | number
        potency?: string
        mrp?: number
        sellingPrice?: number
        discountType?: (typeof discountType.enumValues)[number]
        discount?: number
      }

      interface ApiProduct {
        id: string
        name: string
        form?: string
        unit?: string
        variants?: ApiVariant[]
        categoryName?: string
        manufacturer?: string
        description?: string
      }

      const transformedProducts: ProductCardProps[] = data.products.map(
        (product: ApiProduct) => {
          const image: string[] = product.variants?.find(
            (v: ApiVariant) => v.variantImage && v.variantImage.length > 0
          )?.variantImage || ["https://placehold.co/600x400?text=No+Image"]

          const uniquePackSizes: string[] = [
            ...new Set(
              product.variants
                ?.map((v: ApiVariant) => v.packSize?.toString())
                .filter((size): size is string => Boolean(size)) || []
            ),
          ]
          const uniquePotencies: string[] = [
            ...new Set(
              product.variants
                ?.map((v: ApiVariant) => v.potency)
                .filter((potency): potency is string => Boolean(potency)) || []
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
            category: product.categoryName,
            manufacturer: product.manufacturer,
            description: product.description,
            variants: product.variants,
          }
        }
      )

      return {
        products: transformedProducts,
        total: data.total || data.products.length,
        page: data.page || page,
        limit: data.limit || limit,
        totalPages:
          data.totalPages ||
          Math.ceil((data.total || data.products.length) / limit),
      }
    },
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    setPage(1)
  }, [query, category, manufacturer, potency, form, setPage])

  return (
    <div className="container mx-auto py-8 px-4 min-h-[50vh]">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Search results for "${query}"` : "All Products"}
      </h1>

      {searchQuery.isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : searchQuery.error ? (
        <div>Error: {searchQuery.error.message}</div>
      ) : (
        <div>
          {searchQuery.data?.products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-lg text-gray-500">
                No products found
                {query ? ` for "${query}"` : ""}
                {category ? ` in category "${category}"` : ""}
                {manufacturer ? ` from manufacturer "${manufacturer}"` : ""}
                {potency ? ` with potency "${potency}"` : ""}
                {form ? ` in form "${form}"` : ""}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {(searchQuery.data?.products || []).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {searchQuery.data?.totalPages > 1 && (
                <div className="mt-12 mb-6">
                  <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPage(Math.max(1, Number(page) - 1))}
                      disabled={page <= 1}
                      className="h-10 w-10 rounded-full border border-gray-200 text-gray-500 hover:bg-brand/5 hover:text-brand disabled:opacity-50"
                      aria-label="Previous page"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </Button>

                    {/* Always show first page */}
                    {page > 3 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPage(1)}
                          className={`rounded-full min-w-10 h-10 text-sm font-medium hover:bg-brand/5 hover:text-brand`}
                        >
                          1
                        </Button>
                        {page > 4 && (
                          <span className="px-1 text-gray-400">...</span>
                        )}
                      </>
                    )}

                    {/* Show pages around current page */}
                    {Array.from({ length: searchQuery.data?.totalPages }).map(
                      (_, idx) => {
                        const pageNumber = idx + 1
                        // Show current page and 1 page before and after
                        if (pageNumber >= page - 1 && pageNumber <= page + 1) {
                          if (
                            pageNumber >= 1 &&
                            pageNumber <= searchQuery.data?.totalPages
                          ) {
                            return (
                              <Button
                                key={idx}
                                variant={
                                  page === pageNumber ? "default" : "ghost"
                                }
                                size="sm"
                                onClick={() => setPage(pageNumber)}
                                className={`rounded-full min-w-10 h-10 text-sm font-medium ${
                                  page === pageNumber
                                    ? "bg-brand hover:bg-brand/90 text-white"
                                    : "hover:bg-brand/5 hover:text-brand"
                                }`}
                              >
                                {pageNumber}
                              </Button>
                            )
                          }
                        }
                        return null
                      }
                    )}

                    {/* Always show last page */}
                    {page < searchQuery.data?.totalPages - 2 && (
                      <>
                        {page < searchQuery.data?.totalPages - 3 && (
                          <span className="px-1 text-gray-400">...</span>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPage(searchQuery.data?.totalPages)}
                          className={`rounded-full min-w-10 h-10 text-sm font-medium hover:bg-brand/5 hover:text-brand`}
                        >
                          {searchQuery.data?.totalPages}
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPage(Number(page) + 1)}
                      disabled={page >= searchQuery.data?.totalPages}
                      className="h-10 w-10 rounded-full border border-gray-200 text-gray-500 hover:bg-brand/5 hover:text-brand disabled:opacity-50"
                      aria-label="Next page"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Button>
                  </div>

                  <p className="text-center text-sm text-gray-500 mt-3">
                    Showing page {page} of {searchQuery.data?.totalPages}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
