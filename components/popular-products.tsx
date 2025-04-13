import { executeRawQuery } from "@/db/db"
import ProductCard, { ProductCardProps } from "./product-card"

export default async function PopularProducts() {
  const popularProducts = await executeRawQuery<ProductCardProps>(`
    WITH SalesRanking AS (
      SELECT 
        p."id",
        COUNT(DISTINCT od."orderId") as "sales"
      FROM "Product" p
      JOIN "ProductVariant" pv ON pv."productId" = p."id"
      LEFT JOIN "OrderDetails" od ON od."productVariantId" = pv."id"
      GROUP BY p."id"
      ORDER BY "sales" DESC
      LIMIT 5
    )
    SELECT 
      p."id",
      p."name",
      p."form",
      p."unit",
      sr."sales",
      (SELECT pv."id" FROM "ProductVariant" pv WHERE pv."productId" = p."id" LIMIT 1) as "variantId",
      (SELECT pv."variantImage" FROM "ProductVariant" pv WHERE pv."productId" = p."id" LIMIT 1) as "image",
      (SELECT pv."mrp" FROM "ProductVariant" pv WHERE pv."productId" = p."id" LIMIT 1) as "mrp",
      (SELECT pv."sellingPrice" FROM "ProductVariant" pv WHERE pv."productId" = p."id" LIMIT 1) as "sellingPrice",
      (SELECT pv."discountType" FROM "ProductVariant" pv WHERE pv."productId" = p."id" LIMIT 1) as "discountType",
      (SELECT pv."discount" FROM "ProductVariant" pv WHERE pv."productId" = p."id" LIMIT 1) as "discount",
      (SELECT jsonb_agg(DISTINCT pv."packSize") FROM "ProductVariant" pv WHERE pv."productId" = p."id") as "packSizes",
      (
        CASE 
          WHEN (
            SELECT COUNT(DISTINCT pv."potency") = 1 AND MAX(pv."potency") = 'NONE'  
            FROM "ProductVariant" pv
            WHERE pv."productId" = p."id"
          ) THEN NULL
          ELSE (
            SELECT jsonb_agg(DISTINCT pv."potency")
            FROM "ProductVariant" pv
            WHERE pv."productId" = p."id"
          )
        END
      ) as "potencies"
    FROM "Product" p
    JOIN SalesRanking sr ON p."id" = sr."id"
    ORDER BY sr."sales" DESC
  `)

  return (
    <section className="py-10 border-b">
      <div className="space-y-8 w-full lg:max-w-3/5 mx-auto px-8 lg:px-4 pb-8">
        <h2 className="text-xl md:text-4xl font-bold text-center">
          Popular Products
        </h2>
        {popularProducts.length > 0 && (
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8">
            {/* Left side - featured product (full height) */}
            <div className="h-full flex">
              <ProductCard
                key={popularProducts[0].id}
                product={popularProducts[0]}
                featured={true}
              />
            </div>
            {/* Right side - 4 products in a 2x2 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {popularProducts.slice(1).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
