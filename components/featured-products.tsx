import { executeRawQuery } from "@/db/db"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import FeaturedProductsCarousel from "./featured-products-carousel"
import type { ProductCardProps } from "./product-card"

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
  const motherTinctures = await getProductsByCategory("mothertinctures")
  const biochemics = await getProductsByCategory("biochemics")
  const biocombinations = await getProductsByCategory("biocombinations")
  const personalCare = await getProductsByCategory("personal-care")
  const nutritionSupplements = await getProductsByCategory(
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
