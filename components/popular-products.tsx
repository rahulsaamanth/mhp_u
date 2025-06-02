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
    ),
    ProductVariants AS (
      SELECT 
        pv."productId",
        jsonb_agg(DISTINCT pv."potency") FILTER (WHERE pv."potency" != 'NONE') AS potencies,
        jsonb_agg(DISTINCT pv."packSize" ORDER BY pv."packSize") AS packsizes,
        (
          SELECT pv2.id 
          FROM "ProductVariant" pv2 
          WHERE pv2."productId" = pv."productId" 
          ORDER BY pv2."packSize" ASC 
          LIMIT 1
        ) AS first_variant_id
      FROM "ProductVariant" pv
      GROUP BY pv."productId"
    ),
    FirstVariant AS (
      SELECT 
        pv."id" AS variantid,
        pv."productId",
        pv."variantImage" AS image,
        pv."mrp",
        pv."sellingPrice" AS "sellingPrice",
        pv."discountType" AS "discountType",
        pv."discount"
      FROM "ProductVariant" pv
      JOIN ProductVariants pvs ON pv."id" = pvs.first_variant_id
    )
    SELECT 
      p."id",
      p."name",
      p."form",
      p."unit",
      sr."sales",
      m."name" as "manufacturer",
      fv.variantid AS "variantId",
      fv.image,
      fv.mrp,
      fv."sellingPrice",
      fv."discountType",
      fv.discount,
      CASE 
        WHEN pvs.potencies = '[null]' OR pvs.potencies IS NULL THEN NULL
        ELSE pvs.potencies
      END AS potencies,
      pvs.packsizes AS "packSizes"
    FROM "Product" p
    JOIN SalesRanking sr ON p."id" = sr."id"
    LEFT JOIN "Manufacturer" m ON p."manufacturerId" = m."id"
    JOIN ProductVariants pvs ON pvs."productId" = p."id"
    JOIN FirstVariant fv ON fv."productId" = p."id"
    ORDER BY sr."sales" DESC
  `)

  return (
    <section className="pb-10">
      <div className="flex items-center justify-center mb-8">
        <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-primary"></div>
        <h2 className="text-xl md:text-4xl text-center px-4 font-semibold">
          Popular Products
        </h2>
        <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-primary"></div>
      </div>
      <div className="space-y-8 max-w-fit mx-auto py-8 md:px-16 xl:px-28">
        {popularProducts.length > 0 && (
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 px-4">
            {/* Left side - featured product (full height) */}
            <div className="h-full flex lg:w-2/3 lg:mx-auto 2xl:w-auto 2xl:mx-0 items-center justify-center">
              <ProductCard
                key={popularProducts[0].id}
                product={popularProducts[0]}
                featured={true}
              />
            </div>
            {/* Right side - 4 products in a 2x2 grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
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
