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
        jsonb_agg(DISTINCT pv."packSize" ORDER BY pv."packSize") AS packsizes
      FROM "ProductVariant" pv
      GROUP BY pv."productId"
    ),
    FirstVariantWithImage AS (
      SELECT DISTINCT ON (pv."productId")
        pv."id" AS variantid,
        pv."productId",
        pv."variantImage" AS image,
        pv."mrp",
        pv."sellingPrice" AS "sellingPrice",
        pv."discountType" AS "discountType",
        pv."discount"
      FROM "ProductVariant" pv
      WHERE pv."variantImage" IS NOT NULL 
        AND pv."variantImage" != '{}' 
        AND array_length(pv."variantImage", 1) > 0
      ORDER BY pv."productId", pv."packSize" ASC, pv."id" ASC
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
      fv."sellingPrice",
      fv."discountType",
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
    JOIN FirstVariantWithImage fv ON fv."productId" = p."id"
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

  // console.log(biocombinations)

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
            <TabsTrigger value="biocombinations">biocombinations</TabsTrigger>
            <TabsTrigger value="biochemics">biochemics</TabsTrigger>
            <TabsTrigger value="dilutions">dilutions</TabsTrigger>
            <TabsTrigger value="mother-tinctures">mother-tinctures</TabsTrigger>
            <TabsTrigger value="nutrition-supplements">
              nutrition-supplements
            </TabsTrigger>
            <TabsTrigger value="personal-care">personal-care</TabsTrigger>
          </TabsList>
          <TabsContent value="biocombinations">
            <FeaturedProductsCarousel products={biocombinations} />
          </TabsContent>
          <TabsContent value="biochemics">
            <FeaturedProductsCarousel products={biochemics} />
          </TabsContent>
          <TabsContent value="dilutions">
            <FeaturedProductsCarousel products={dilutions} />
          </TabsContent>
          <TabsContent value="mother-tinctures">
            <FeaturedProductsCarousel products={motherTinctures} />
          </TabsContent>
          <TabsContent value="nutrition-supplements">
            <FeaturedProductsCarousel products={nutritionSupplements} />
          </TabsContent>
          <TabsContent value="personal-care" className="pb-8">
            <FeaturedProductsCarousel products={personalCare} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
