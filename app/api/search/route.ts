import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/db"
import { and, desc, eq, ilike, or, sql } from "drizzle-orm"

// Define a proper interface for the API response
interface ProductSearchResult {
  id: string
  name: string
  description: string
  form: string
  unit: string
  tags: string[]
  category: string
  manufacturer: string
  variants: {
    id: string
    variantName: string
    potency: string
    packSize?: number
    sellingPrice: number
    mrp: number
    discount: number
    discountType: string
    variantImage: string[]
    stockByLocation: Array<{ location: string; stock: number }>
  }[]
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const query = url.searchParams.get("q") || ""
    const categoryFilter = url.searchParams.get("category") || ""
    const manufacturerFilter = url.searchParams.get("manufacturer") || ""
    const potencyFilter = url.searchParams.get("potency") || ""
    const formFilter = url.searchParams.get("form") || ""
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "12")

    // Calculate offset for pagination
    const offset = (page - 1) * limit

    // Sanitize inputs
    const sanitizedQuery = query.replace(/[^\w\s]/gi, "").trim()
    const searchPattern = sanitizedQuery ? `%${sanitizedQuery}%` : null

    // Use raw SQL for more complex query with proper joins
    const productsQuery = sql`
      SELECT 
        p.id, 
        p.name, 
        p.description,
        p.form,
        p.unit,
        p.tags,
        c.name AS "categoryName",
        m.name AS "manufacturerName",
        MIN(v."sellingPrice") AS "minPrice",
        COUNT(*) OVER() AS "totalCount",
        JSON_AGG(DISTINCT jsonb_build_object(
          'id', v.id,
          'variantName', v."variantName",
          'potency', v.potency,
          'packSize', v."packSize", 
          'sellingPrice', v."sellingPrice",
          'mrp', v.mrp,
          'discount', v.discount,
          'discountType', v."discountType",
          'variantImage', v."variantImage",
          'stockByLocation', v."stockByLocation"
        )) AS "variants"
      FROM "Product" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      LEFT JOIN "Manufacturer" m ON p."manufacturerId" = m.id
      LEFT JOIN "ProductVariant" v ON v."productId" = p.id
      WHERE 1=1
        ${
          searchPattern
            ? sql`AND (
          p.name ILIKE ${searchPattern}
          OR p.description ILIKE ${searchPattern}
          OR c.name ILIKE ${searchPattern}
          OR m.name ILIKE ${searchPattern}
          OR ${searchPattern} = ANY(p.tags)
        )`
            : sql``
        }
        ${
          categoryFilter
            ? sql`AND c.name ILIKE ${`%${categoryFilter}%`}`
            : sql``
        }
        ${
          manufacturerFilter
            ? sql`AND m.name ILIKE ${`%${manufacturerFilter}%`}`
            : sql``
        }
        ${potencyFilter ? sql`AND v.potency = ${potencyFilter}` : sql``}
        ${formFilter ? sql`AND p.form = ${formFilter}` : sql``}
        AND p.status = 'ACTIVE'
        AND (v.discontinued = FALSE OR v.discontinued IS NULL)
      GROUP BY p.id, c.name, m.name
      ORDER BY 
        CASE 
          WHEN ${
            searchPattern ? sql`p.name ILIKE ${searchPattern}` : sql`FALSE`
          } THEN 1
          WHEN ${
            searchPattern ? sql`c.name ILIKE ${searchPattern}` : sql`FALSE`
          } THEN 2
          ELSE 3
        END,
        p."createdAt" DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    const products = (await db.execute(productsQuery)).rows

    // Extract total count from the first row
    const totalCount =
      products.length > 0 ? parseInt(String(products[0].totalCount)) : 0
    const totalPages = Math.ceil(totalCount / limit)

    // Transform the products to the expected format
    const transformedProducts: ProductSearchResult[] = products.map(
      (product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description || "",
        category: product.categoryName || "",
        manufacturer: product.manufacturerName || "",
        form: product.form || "NONE",
        unit: product.unit || "NONE",
        tags: Array.isArray(product.tags) ? product.tags : [],
        // Ensure variants have consistent data structure
        variants: Array.isArray(product.variants)
          ? product.variants.map((variant: any) => ({
              id: variant.id || "",
              variantName: variant.variantName || "",
              potency: variant.potency || "NONE",
              packSize: variant.packSize || 0,
              sellingPrice: variant.sellingPrice || 0,
              mrp: variant.mrp || 0,
              discount: variant.discount || 0,
              discountType: variant.discountType || "PERCENTAGE",
              variantImage: Array.isArray(variant.variantImage)
                ? variant.variantImage
                : ["https://placehold.co/600x400?text=No+Image"],
              stockByLocation: Array.isArray(variant.stockByLocation)
                ? variant.stockByLocation
                : [],
            }))
          : [],
      })
    )

    return NextResponse.json({
      products: transformedProducts,
      total: totalCount,
      page,
      limit,
      totalPages,
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    )
  }
}
