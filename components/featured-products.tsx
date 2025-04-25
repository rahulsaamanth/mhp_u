import { executeRawQuery } from "@/db/db"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import FeaturedProductsCarousel from "./featured-products-carousel"
import type { ProductCardProps } from "./product-card"

async function getFeaturedProductsByCategory(
  category: string
): Promise<ProductCardProps[]> {
  return await executeRawQuery<ProductCardProps>(
    `WITH ProductVariants AS (
      SELECT 
        pv."productId",
        jsonb_agg(DISTINCT pv."potency") FILTER (WHERE pv."potency" != 'NONE') AS potencies,
        jsonb_agg(DISTINCT pv."packSize") AS packsizes,
        MIN(pv."id") AS first_variant_id
      FROM "ProductVariant" pv
      GROUP BY pv."productId"
    ),
    FirstVariant AS (
      SELECT 
        pv."id" AS variantid,
        pv."productId",
        pv."variantImage" AS image,
        pv."mrp",
        pv."sellingPrice" AS sellingprice,
        pv."discountType" AS discounttype,
        pv."discount"
      FROM "ProductVariant" pv
      JOIN ProductVariants pvs ON pv."id" = pvs.first_variant_id
    )
    SELECT
      p."id",
      p."name",
      p."form",
      p."unit",
      m."name" AS manufacturer,
      fv.variantid AS "variantId",
      fv.image,
      fv.mrp,
      fv.sellingprice AS "sellingPrice",
      fv.discounttype AS "discountType",
      fv.discount,
      CASE 
        WHEN pvs.potencies = '[null]' OR pvs.potencies IS NULL THEN NULL
        ELSE pvs.potencies
      END AS potencies,
      pvs.packsizes AS "packSizes"
    FROM "Product" p
    JOIN "Category" c ON p."categoryId" = c."id"
    JOIN "Manufacturer" m ON p."manufacturerId" = m."id"
    JOIN ProductVariants pvs ON pvs."productId" = p."id"
    JOIN FirstVariant fv ON fv."productId" = p."id"
    WHERE 
      p."isFeatured" = true AND
      c."name" ILIKE $1
    ORDER BY p."name" ASC;`,
    [category]
  )
}
export default async function FeaturedProducts() {
  const dilutions = await getFeaturedProductsByCategory("dilutions")
  const motherTinctures = await getFeaturedProductsByCategory("mothertinctures")
  const biochemics = await getFeaturedProductsByCategory("biochemics")
  const biocombinations = await getFeaturedProductsByCategory("biocombinations")
  const personalCare = await getFeaturedProductsByCategory("personal-care")
  const nutritionSupplements = await getFeaturedProductsByCategory(
    "nutrition-supplements"
  )

  return (
    <section className="py-10">
      <div className="mx-auto px-4 space-y-8">
        <div className="flex items-center justify-center mb-12">
          <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-primary"></div>
          <h2 className="text-xl md:text-4xl text-center px-4 font-semibold">
            Featured Products
          </h2>
          <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-primary"></div>
        </div>

        <Tabs
          defaultValue="biocombinations"
          className="mx-auto h-full space-y-8"
        >
          <TabsList className="bg-transparent flex items-center justify-between flex-wrap gap-6 h-fit mx-auto">
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
            <FeaturedProductsCarousel products={dilutions} />
          </TabsContent>
          <TabsContent value="mother-tinctures">
            <FeaturedProductsCarousel products={motherTinctures} />
          </TabsContent>
          <TabsContent value="biochemics">
            <FeaturedProductsCarousel products={biochemics} />
          </TabsContent>
          <TabsContent value="biocombinations">
            <FeaturedProductsCarousel products={biocombinations} />
          </TabsContent>
          <TabsContent value="personal-care">
            <FeaturedProductsCarousel products={personalCare} />
          </TabsContent>
          <TabsContent value="nutrition-supplements" className="pb-8">
            <FeaturedProductsCarousel products={nutritionSupplements} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
