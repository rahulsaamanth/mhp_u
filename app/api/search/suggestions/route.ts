import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db/db"
import { sql } from "drizzle-orm"

interface ProductSuggestion {
  id: string
  name: string
  description: string
  form: string
  unit: string
  tags: string[]
  category: string
  manufacturer: string
  minPrice: number
  variants: {
    id: string
    variantName: string
    potency: string
    packSize?: number
    sellingPrice: number
    mrp: number
    discount?: number
    discountType?: string
    variantImage?: string[]
  }[]
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const query = url.searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] }, { status: 200 })
    }

    const sanitizedQuery = query.replace(/[^\w\s]/gi, "").trim()
    const searchPattern = `%${sanitizedQuery}%`

    const products = await db.execute(sql`
      WITH product_matches AS (
        SELECT 
          p.id, 
          p.name, 
          p.description,
          p.form,
          p.unit,
          p.tags,
          c.name AS "categoryName",
          m.name AS "manufacturerName"
        FROM "Product" p
        LEFT JOIN "Category" c ON p."categoryId" = c.id
        LEFT JOIN "Manufacturer" m ON p."manufacturerId" = m.id
        LEFT JOIN "ProductVariant" v ON v."productId" = p.id
        WHERE 
          (p.name ILIKE ${searchPattern} OR
          p.description ILIKE ${searchPattern} OR
          c.name ILIKE ${searchPattern} OR
          m.name ILIKE ${searchPattern} OR
          CAST(v.potency AS TEXT) ILIKE ${searchPattern} OR
          v."variantName" ILIKE ${searchPattern} OR
          ${searchPattern} = ANY(p.tags))
          AND p.status = 'ACTIVE'
          AND (v.discontinued = FALSE OR v.discontinued IS NULL)
        GROUP BY p.id, c.name, m.name
        ORDER BY 
          CASE 
            WHEN p.name ILIKE ${searchPattern} THEN 1
            WHEN c.name ILIKE ${searchPattern} THEN 2
            WHEN m.name ILIKE ${searchPattern} THEN 3
            ELSE 4
          END
        LIMIT 5
      )
      SELECT 
        pm.*,
        MIN(v."sellingPrice") AS "minPrice",
        JSON_AGG(DISTINCT jsonb_build_object(
          'id', v.id,
          'variantName', v."variantName",
          'potency', v.potency,
          'packSize', v."packSize", 
          'sellingPrice', v."sellingPrice",
          'mrp', v.mrp,
          'discount', v.discount,
          'discountType', v."discountType",
          'variantImage', v."variantImage"
        )) AS "variants"
      FROM product_matches pm
      LEFT JOIN "ProductVariant" v ON v."productId" = pm.id
      GROUP BY pm.id, pm.name, pm.description, pm.form, pm.unit, pm.tags, pm."categoryName", pm."manufacturerName"
    `)

    const suggestions: ProductSuggestion[] = products.rows.map(
      (product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description || "",
        category: product.categoryName || "",
        manufacturer: product.manufacturerName || "",
        form: product.form || "NONE",
        unit: product.unit || "NONE",
        tags: Array.isArray(product.tags) ? product.tags : [],
        minPrice: product.minPrice || 0,
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
            }))
          : [],
      })
    )

    return NextResponse.json({ suggestions }, { status: 200 })
  } catch (error) {
    console.error("Search suggestions error:", error)
    return NextResponse.json(
      { error: "Failed to fetch suggestions" },
      { status: 500 }
    )
  }
}
