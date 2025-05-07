"use client"

import { useEffect, useState, useMemo } from "react"
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

  const initialPage = parseInt(searchParams.get("page") || "1", 10)
  const [currentPage, setCurrentPage] = useState<number>(initialPage)

  const totalPages = Math.ceil(products.length / perPage)

  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  const visibleProducts = products.slice(startIndex, endIndex)

  const visiblePageNumbers = useMemo(() => {
    const pageNumbers: number[] = []
    let start: number
    let end: number

    if (totalPages <= 10) {
      start = 1
      end = totalPages
    } else {
      if (currentPage <= 6) {
        start = 1
        end = 10
      } else if (currentPage > totalPages - 5) {
        start = totalPages - 9
        end = totalPages
      } else {
        start = currentPage - 4
        end = currentPage + 5
      }
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }, [currentPage, totalPages])

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

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2 group">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 px-4 py-2 cursor-pointer group-[]:hover:bg-brand-foreground group-[]:hover:text-white disabled:group-[]:hover:bg-transparent"
              >
                Previous
              </Button>

              <div className="flex items-center gap-1 [&_button]:hover:bg-brand-foreground [&_button]:hover:text-white [&_button.active]:bg-brand-foreground [&_button.active]:text-white">
                {!visiblePageNumbers.includes(1) && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(1)}
                      className="h-10 w-10 cursor-pointer"
                    >
                      1
                    </Button>
                    <span className="px-1">...</span>
                  </>
                )}

                {visiblePageNumbers.map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                    className={`h-10 w-10 cursor-pointer ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    {page}
                  </Button>
                ))}

                {!visiblePageNumbers.includes(totalPages) && (
                  <>
                    <span className="px-1">...</span>
                    <Button
                      variant="outline"
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
                className="h-10 px-4 py-2 cursor-pointer group-[]:hover:bg-brand-foreground group-[]:hover:text-white disabled:group-[]:hover:bg-transparent"
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
