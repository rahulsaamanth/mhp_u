import { executeRawQuery } from "@/db/db"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import FeaturedProducts from "@/components/featured-products"
import ProductVariantSelector from "../_components/product-variant-selector"
import { StockByLocation } from "@rahulsaamanth/mhp-schema"

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
    stockByLocation: StockByLocation[]
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
              'stockByLocation', pv."stockByLocation",
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
                  {product.unit.replace("(s)", "").replace("TABLETS", "Pills")}{" "}
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
                    {uniquePotencies.length > 0 && uniquePotencies[0] !== "NONE"
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
      <div className="py-8">
        <h2 className="text-xl font-semibold mb-6 text-center">
          You May Also Like
        </h2>
        <Suspense fallback={<div>Loading related products...</div>}>
          <FeaturedProducts />
        </Suspense>
      </div>
    </div>
  )
}
