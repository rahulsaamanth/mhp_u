import { executeRawQuery } from "@/db/db"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import JsonLd from "@/components/json-ld"
import ProductCard, { ProductCardProps } from "@/components/product-card"
import ProductVariantSelector from "../_components/product-variant-selector"
import FeaturedProductsCarousel from "@/components/featured-products-carousel"
import FeaturedProducts from "@/components/featured-products"
import ScrollToTop from "../_components/scroll-to-top"
import { generateBreadcrumbSchema, generateProductSchema } from "@/lib/schema"

interface ProductDetailsProps {
  id: string
  name: string
  description: string
  form: string
  unit: string
  manufacturer: string
  isFeatured: boolean
  status: string
  categoryId: string
  categoryName: string
  variants: Array<{
    id: string
    variantName: string
    sku: string
    potency: string
    packSize: string
    mrp: number
    sellingPrice: number
    discount: number
    discountType: string
    variantImage: string[]
    inventory: Array<{
      storeId: string
      stock: number
    }>
    discontinued: boolean
  }>
}

async function getProductDetails(
  id: string
): Promise<ProductDetailsProps | null> {
  try {
    const products = await executeRawQuery<ProductDetailsProps>(
      `
      SELECT 
        p."id",
        p."name",
        p."description",
        p."form",
        p."unit",
        m."name" as "manufacturer",
        p."isFeatured",
        p."status",
        c."id" as "categoryId",
        c."name" as "categoryName",
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', pv."id",
              'variantName', pv."variantName",
              'sku', pv."sku",
              'potency', pv."potency",
              'packSize', pv."packSize",
              'mrp', pv."mrp",
              'sellingPrice', pv."sellingPrice",
              'discount', pv."discount",
              'discountType', pv."discountType",
              'variantImage', pv."variantImage",
              'inventory', (
                SELECT jsonb_agg(
                  jsonb_build_object(
                    'storeId', pi."storeId",
                    'stock', pi."stock"
                  )
                )
                FROM "ProductInventory" pi
                WHERE pi."productVariantId" = pv."id"
              ),
              'discontinued', pv."discontinued"
            )
          )
          FROM "ProductVariant" pv
          WHERE pv."productId" = p."id" AND pv."discontinued" = false
        ) as "variants"
      FROM "Product" p
      LEFT JOIN "Manufacturer" m ON p."manufacturerId" = m."id"
      LEFT JOIN "Category" c ON p."categoryId" = c."id"
      WHERE p."id" = $1
      LIMIT 1
    `,
      [id]
    )

    return products && products.length > 0 ? products[0] : null
  } catch (error) {
    console.error("Error fetching product details:", error)
    return null
  }
}

async function getRelatedProducts(
  productId: string,
  categoryId: string,
  form: string,
  manufacturerName: string
): Promise<ProductCardProps[]> {
  try {
    return await executeRawQuery<ProductCardProps>(
      `
      WITH ProductVariants AS (
        SELECT 
          pv."productId",
          jsonb_agg(DISTINCT pv."potency") FILTER (WHERE pv."potency" != 'NONE') AS potencies,
          jsonb_agg(DISTINCT pv."packSize" ORDER BY pv."packSize") AS "packSizes"
        FROM "ProductVariant" pv
        GROUP BY pv."productId"
      ),
      FirstVariantWithImage AS (
        SELECT DISTINCT ON (pv."productId")
          pv."id" AS "variantId",
          pv."productId",
          pv."variantImage" AS "image",
          pv."mrp",
          pv."sellingPrice",
          pv."discountType",
          pv."discount"
        FROM "ProductVariant" pv
        WHERE pv."variantImage" IS NOT NULL 
          AND pv."variantImage" != '{}' 
          AND array_length(pv."variantImage", 1) > 0
        ORDER BY pv."productId", pv."packSize" ASC, pv."id" ASC
      ),
      RelatedProducts AS (
        (
          -- Products from same category
          SELECT p.*, 1 as priority
          FROM "Product" p
          WHERE p."categoryId" = $1 AND p."id" != $2 AND p.status = 'ACTIVE'
          LIMIT 6
        )
        UNION ALL
        (
          -- Products from same manufacturer
          SELECT p.*, 2 as priority
          FROM "Product" p
          JOIN "Manufacturer" man ON p."manufacturerId" = man."id"
          WHERE man."name" = $3 AND p."id" != $2 AND p.status = 'ACTIVE'
          AND p."categoryId" != $1  -- Exclude products already included from category
          LIMIT 3
        )
        UNION ALL
        (
          -- Products with same form
          SELECT p.*, 3 as priority
          FROM "Product" p
          JOIN "Manufacturer" man ON p."manufacturerId" = man."id" 
          WHERE p.form = $4 AND p."id" != $2 AND p.status = 'ACTIVE'
          AND p."categoryId" != $1  -- Exclude products already included from category
          AND man."name" != $3  -- Exclude products already included from manufacturer
          LIMIT 3
        )
      )
      SELECT DISTINCT ON (p."id")
        p."id",
        p."name",
        p."form",
        p."unit",
        m."name" as "manufacturer",
        fv."variantId",
        fv."image",
        fv."mrp",
        fv."sellingPrice",
        fv."discountType",
        fv."discount",
        pvs.potencies,
        pvs."packSizes"
      FROM RelatedProducts p
      JOIN "Category" c ON p."categoryId" = c."id"
      JOIN "Manufacturer" m ON p."manufacturerId" = m."id"
      JOIN ProductVariants pvs ON pvs."productId" = p."id"
      JOIN FirstVariantWithImage fv ON fv."productId" = p."id"
      ORDER BY p."id", priority ASC
      LIMIT 12
      `,
      [categoryId, productId, manufacturerName, form]
    )
  } catch (error) {
    console.error("Error fetching related products:", error)
    return []
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const product = await getProductDetails(id)

  if (!product) {
    notFound()
  }

  // Generate product schema for SEO
  const productSchema = await generateProductSchema(id)

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: product.categoryName, item: `/products/${product.categoryId}` },
    { name: product.name, item: `/product/${product.id}` },
  ])

  // Fetch related products
  const relatedProducts = await getRelatedProducts(
    product.id,
    product.categoryId,
    product.form,
    product.manufacturer
  )

  const sortedVariants = [...product.variants].sort((a, b) => {
    if (a.potency !== b.potency) {
      return a.potency.localeCompare(b.potency)
    }

    return parseInt(a.packSize) - parseInt(b.packSize)
  })

  const uniquePotencies = Array.from(
    new Set(sortedVariants.map((v) => v.potency))
  ).filter((p) => p !== "NONE")
  const uniquePackSizes = Array.from(
    new Set(sortedVariants.map((v) => v.packSize))
  )

  return (
    <ScrollToTop>
      {productSchema && <JsonLd data={productSchema} />}
      <JsonLd data={breadcrumbSchema} />
      <div>
        <main className="container mx-auto px-4 py-20">
          <div className="mb-10">
            {sortedVariants.length > 0 && (
              <ProductVariantSelector
                productId={product.id}
                productName={product.name}
                variants={sortedVariants}
                unit={product.unit}
                category={product.categoryName}
                manufacturer={product.manufacturer}
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
            <div className="md:col-span-3 space-y-8">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Description</h2>
                <div className="text-gray-700 text-sm space-y-2">
                  {product.description ? (
                    <p>{product.description}</p>
                  ) : (
                    <p>No description available for this product.</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Key Benefits</h2>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>High quality homeopathic preparation</li>
                  <li>Manufactured according to homeopathic principles</li>
                  <li>No side effects when taken as directed</li>
                  {product.form === "LIQUID" ? (
                    <li>Liquid formulation for easy administration</li>
                  ) : (
                    <li>Convenient tablet form for easy dosage</li>
                  )}
                  <li>Suitable for adults and children (as directed)</li>
                </ul>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-lg font-semibold">Recommended Dosage</h2>
              <div className="text-gray-700 text-sm">
                <p>As prescribed by your physician. The general dosage is:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>
                    Adults: 2{" "}
                    {product.unit
                      .replace("(s)", "")
                      .replace("TABLETS", "Pills")}{" "}
                    3-4 times daily
                  </li>
                  <li>
                    Children: 1{" "}
                    {product.unit.replace("(s)", "").replace("TABLETS", "Pill")}{" "}
                    3-4 times daily
                  </li>
                  <li>
                    Acute conditions: 1{" "}
                    {product.unit.replace("(s)", "").replace("TABLETS", "Pill")}{" "}
                    every 30 minutes (up to 6 doses)
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Product Information</h2>
            <div className="border rounded overflow-hidden">
              <table className="w-full divide-y">
                <tbody className="divide-y">
                  <tr className="bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-700 w-1/3">
                      Product Form
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {product.form}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-700">
                      Unit
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {product.unit}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-700">
                      Manufacturer
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {product.manufacturer}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-700">
                      Category
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {product.categoryName}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-700">
                      Available Potencies
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {uniquePotencies.length > 0 &&
                      uniquePotencies[0] !== "NONE"
                        ? uniquePotencies.join(", ")
                        : "N/A"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm font-medium text-gray-700">
                      Available Pack Sizes
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {uniquePackSizes
                        .map(
                          (size) =>
                            `${size} ${product.unit
                              .replace("(s)", "")
                              .replace("TABLETS", "Pills")}`
                        )
                        .join(", ")}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-3 text-sm font-medium text-gray-700">
                      Storage Instructions
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      Store in a cool, dry place away from direct sunlight. Keep
                      out of reach of children.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <div className="py-8 mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-center">
            {relatedProducts.length > 0 ? "You May Also Like" : ""}
          </h2>
          {relatedProducts.length > 0 ? (
            <FeaturedProductsCarousel products={relatedProducts} />
          ) : (
            <Suspense>
              <FeaturedProducts />
            </Suspense>
          )}
        </div>
      </div>
    </ScrollToTop>
  )
}
