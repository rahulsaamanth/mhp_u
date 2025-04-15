import ProductCard, { ProductCardProps } from "@/components/product-card"

interface ProductListProps {
  products: ProductCardProps[]
}

export default function ProductList({ products }: ProductListProps) {
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
          <p className="text-sm mb-4">{products.length} products found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
