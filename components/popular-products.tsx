import { db, sql } from "@/db/db"
import { JsonViewer } from "@/utils/json-viewer"

export default async function PopularProducts() {
  const popularProducts = await sql`
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
      sr."sales",
      (SELECT pv."variantImage" FROM "ProductVariant" pv WHERE pv."productId" = p."id" LIMIT 1) as "image",
      (SELECT pv."mrp" FROM "ProductVariant" pv WHERE pv."productId" = p."id" LIMIT 1) as "mrp",
      (SELECT pv."sellingPrice" FROM "ProductVariant" pv WHERE pv."productId" = p."id" LIMIT 1) as "sellingPrice",
      (SELECT pv."discountType" FROM "ProductVariant" pv WHERE pv."productId" = p."id" LIMIT 1) as "discountType",
      (SELECT pv."discount" FROM "ProductVariant" pv WHERE pv."productId" = p."id" LIMIT 1) as "discount",
      (
        SELECT jsonb_agg(DISTINCT pv."potency")
        FROM "ProductVariant" pv
        WHERE pv."productId" = p."id"
      ) as "potencies"
    FROM "Product" p
    JOIN SalesRanking sr ON p."id" = sr."id"
    ORDER BY sr."sales" DESC
  `

  console.log(popularProducts)

  return (
    <div>
      <JsonViewer data={popularProducts} />
    </div>
  )
}
