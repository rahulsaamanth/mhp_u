"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import ProductCard, { ProductCardProps } from "@/components/product-card"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

interface ProductListProps {
  products: ProductCardProps[]
}

export default function ProductList({ products }: ProductListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const loaderRef = useRef<HTMLDivElement>(null)
  const perPage = 8

  // Get current page from URL or default to 1
  const initialPage = parseInt(searchParams.get("page") || "1", 10)
  const [page, setPage] = useState<number>(initialPage)
  const [isLoading, setIsLoading] = useState(false)

  // Calculate how many products to show based on current page
  const visibleProducts = products.slice(0, page * perPage)

  // Update URL when page changes
  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    // Only update if page changed
    if (page !== parseInt(current.get("page") || "1", 10)) {
      current.set("page", page.toString())

      // Create new URL with updated page parameter
      const search = current.toString()
      const query = search ? `?${search}` : ""

      // Update URL without reloading the page
      router.push(`${pathname}${query}`, { scroll: false })
    }
  }, [page, router, pathname, searchParams])

  // Load more products when scrolling to bottom
  const loadMoreProducts = useCallback(() => {
    if (isLoading || page * perPage >= products.length) return

    setIsLoading(true)

    // Add a small delay to show loading indicator
    setTimeout(() => {
      setPage((prevPage) => prevPage + 1)
      setIsLoading(false)
    }, 300)
  }, [isLoading, page, products.length])

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!loaderRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMoreProducts()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(loaderRef.current)

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [loadMoreProducts, isLoading])

  return (
    <div>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-sm text-gray-500 mt-2">
            Try changing your filter options or search for a different category.
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm">{products.length} products found</p>
            <p className="text-sm">
              Page {page} of {Math.ceil(products.length / perPage)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Loading indicator and sentinel element for infinite scroll */}
          {visibleProducts.length < products.length && (
            <div ref={loaderRef} className="w-full py-8 flex justify-center">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-t-2 border-brand border-solid rounded-full animate-spin"></div>
                  <span className="ml-2">Loading more products...</span>
                </div>
              ) : (
                <div className="h-16"></div> // Invisible sentinel element
              )}
            </div>
          )}

          {/* Add manual pagination links as a fallback */}
          {visibleProducts.length < products.length && (
            <div className="w-full flex justify-center pt-4 pb-8">
              <button
                onClick={loadMoreProducts}
                disabled={isLoading}
                className="px-4 py-2 bg-brand text-white rounded hover:bg-brand/90 disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
