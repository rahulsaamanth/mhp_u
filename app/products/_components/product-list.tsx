"use client"

import { useEffect, useState } from "react"
import ProductCard, { ProductCardProps } from "@/components/product-card"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ProductListProps {
  products: ProductCardProps[]
}

export default function ProductList({ products }: ProductListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const perPage = 8

  // Get current page from URL or default to 1
  const initialPage = parseInt(searchParams.get("page") || "1", 10)
  const [currentPage, setCurrentPage] = useState<number>(initialPage)

  // Calculate total pages
  const totalPages = Math.ceil(products.length / perPage)

  // Calculate visible products for current page
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const visibleProducts = products.slice(startIndex, endIndex)

  // Update URL when page changes
  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))

    if (currentPage !== parseInt(current.get("page") || "1", 10)) {
      if (currentPage === 1) {
        current.delete("page")
      } else {
        current.set("page", currentPage.toString())
      }

      const search = current.toString()
      const query = search ? `?${search}` : ""

      router.push(`${pathname}${query}`, { scroll: true })
    }
  }, [currentPage, router, pathname, searchParams])

  // Handle page navigation
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

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
              Page {currentPage} of {totalPages}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 px-4 py-2 cursor-pointer"
              >
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {/* First page */}
                {currentPage > 2 && (
                  <>
                    <Button
                      variant={currentPage === 1 ? "default" : "outline"}
                      onClick={() => handlePageChange(1)}
                      className="h-10 w-10 cursor-pointer"
                    >
                      1
                    </Button>
                    {currentPage > 3 && <span className="px-1">...</span>}
                  </>
                )}

                {/* Current page and siblings */}
                {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                  .filter((page) => page > 0 && page <= totalPages)
                  .map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className="h-10 w-10 cursor-pointer"
                    >
                      {page}
                    </Button>
                  ))}

                {/* Last page */}
                {currentPage < totalPages - 1 && (
                  <>
                    {currentPage < totalPages - 2 && (
                      <span className="px-1">...</span>
                    )}
                    <Button
                      variant={
                        currentPage === totalPages ? "default" : "outline"
                      }
                      onClick={() => handlePageChange(totalPages)}
                      className="h-10 w-10 cursor-pointer"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-10 px-4 py-2 cursor-pointer"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
