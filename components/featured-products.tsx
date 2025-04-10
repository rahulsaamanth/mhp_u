import { db, executeRawQuery } from "@/db/db"
import { product, type Variant } from "@rahulsaamanth/mhp-schema"
import { and, eq, ilike } from "drizzle-orm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { ProductCardProps } from "./product-card"
import { JsonViewer } from "@/utils/json-viewer"

async function getProductsByCategory(
  category: string
): Promise<ProductCardProps[]> {
  return await executeRawQuery<ProductCardProps>(
    `WITH FeaturedProducts AS (
      SELECT
        p."id",
        p."name",
        p."form",
        p."unit",
        c."name" as "category",
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
      JOIN "Category" c ON p."categoryId" = c."id"
      WHERE p."isFeatured" = true
    )
    SELECT * 
    FROM FeaturedProducts
    WHERE "category" ILIKE $1
    ORDER BY "name" ASC;
    `,
    [category]
  )
}

export default async function FeaturedProducts() {
  const dilutions = await getProductsByCategory("dilutions")

  console.log(dilutions)

  return (
    <section className="py-10 border-b">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        <h2 className="text-base md:text-4xl font-bold text-center">
          Featured Products
        </h2>
        <Tabs defaultValue="dilutions" className="w-full h-full">
          <TabsList className="bg-transparent flex items-center justify-between flex-wrap gap-x-6 h-fit">
            <TabsTrigger value="dilutions">dilutions</TabsTrigger>
            <TabsTrigger value="mother-tinctures">mother-tinctures</TabsTrigger>
            <TabsTrigger value="biochemics">biochemics</TabsTrigger>
            <TabsTrigger value="biocombinations">biocombinations</TabsTrigger>
            <TabsTrigger value="personal-care">personal-care</TabsTrigger>
            <TabsTrigger value="nutrition-supplements">
              nutrition-supplements
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dilutions">
            <JsonViewer data={dilutions} />
          </TabsContent>
          <TabsContent value="mother-tinctures">
            mother-tinctures content
          </TabsContent>
          <TabsContent value="biochemics">biochemics content</TabsContent>
          <TabsContent value="biocombinations">
            biocombinations content
          </TabsContent>
          <TabsContent value="personal-care">personal-care content</TabsContent>
          <TabsContent value="nutrition-supplements">
            nutrition-supplements content
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
