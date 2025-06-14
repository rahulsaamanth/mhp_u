import { executeRawQuery } from "@/db/db"
import { ProductCardProps } from "@/components/product-card"
import JsonLd from "@/components/json-ld"
import { generateBreadcrumbSchema } from "@/lib/schema"
import ProductList from "../../_components/product-list"
import FilterSidebar from "../../_components/filter-sidebar"
import Link from "next/link"

interface CategoryItem {
  id: string
  name: string
  path: string
  parentId: string | null
  depth: number
}

async function getProductsBySubcategory(
  category: string,
  subcategory: string,
  manufacturer?: string,
  letter?: string,
  ailment?: string
): Promise<{
  products: ProductCardProps[]
  manufacturers: string[]
  categories: CategoryItem[]
  parentCategory: CategoryItem | null
  subcategoryInfo: CategoryItem | null
}> {
  let conditions = `LOWER(REPLACE(c.name, ' ', '-')) = LOWER($1)`
  const params: any[] = [subcategory]

  if (manufacturer) {
    conditions += ` AND m.name = $${params.length + 1}`
    params.push(manufacturer)
  }

  if (letter) {
    conditions += ` AND p.name ILIKE $${params.length + 1}`
    params.push(`${letter}%`)
  }

  if (ailment) {
    const normalizedAilment = ailment.replace(/[^a-zA-Z0-9]/g, "")

    conditions += ` AND EXISTS (
      SELECT 1 FROM unnest(p.tags) tag 
      WHERE tag ILIKE $${params.length + 1}
    )`
    params.push(`%${normalizedAilment}%`)
  }

  let orderBy = "p.name ASC"

  const products = await executeRawQuery<ProductCardProps>(
    `
    WITH CategoryProducts AS (
      SELECT
        p."id",
        p."name",
        p."form",
        p."unit",
        c."name" as "category",
        m."name" as "manufacturer",
        (SELECT pv."id" FROM "ProductVariant" pv WHERE pv."productId" = p."id" LIMIT 1) as "variantId",
        (SELECT pv."variantImage" FROM "ProductVariant" pv WHERE pv."productId" = p."id" AND pv."variantImage" IS NOT NULL AND pv."variantImage" != '{}' AND array_length(pv."variantImage", 1) > 0 ORDER BY pv."id" ASC LIMIT 1) as "image",
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
      JOIN "Manufacturer" m ON p."manufacturerId" = m."id"
      WHERE ${conditions}
      GROUP BY p."id", c."name", m."name"
      ORDER BY ${orderBy}
    )
    SELECT * FROM CategoryProducts
  `,
    params
  )

  const manufacturersQuery = `
    SELECT DISTINCT m.name
    FROM "Product" p
    JOIN "Category" c ON p."categoryId" = c."id"
    JOIN "Manufacturer" m ON p."manufacturerId" = m."id"
    WHERE ${conditions}
    ORDER BY m.name ASC
  `

  const manufacturers = await executeRawQuery<{ name: string }>(
    manufacturersQuery,
    params
  )

  const categories = await executeRawQuery<CategoryItem>(
    `
    SELECT 
      id, 
      name, 
      "parentId", 
      depth, 
      path
    FROM "Category"
    ORDER BY depth ASC, name ASC
    `
  )

  const parentCategoryInfo = await executeRawQuery<CategoryItem>(
    `
    SELECT 
      parent.id, 
      parent.name, 
      parent."parentId", 
      parent.depth, 
      parent.path
    FROM "Category" subcategory
    JOIN "Category" parent ON subcategory."parentId" = parent.id
    WHERE LOWER(REPLACE(subcategory.name, ' ', '-')) = LOWER($1)
    LIMIT 1
    `,
    [subcategory]
  )

  const subcategoryInfo = await executeRawQuery<CategoryItem>(
    `
    SELECT 
      id, 
      name, 
      "parentId", 
      depth, 
      path
    FROM "Category"
    WHERE LOWER(REPLACE(name, ' ', '-')) = LOWER($1)
    LIMIT 1
    `,
    [subcategory]
  )

  return {
    products,
    manufacturers: manufacturers.map((m) => m.name),
    categories,
    parentCategory:
      parentCategoryInfo.length > 0 ? parentCategoryInfo[0] : null,
    subcategoryInfo: subcategoryInfo.length > 0 ? subcategoryInfo[0] : null,
  }
}

interface PageProps {
  params: {
    category: string
    subcategory: string
  }
  searchParams: {
    manufacturer?: string
    letter?: string
    page?: string
    ailment?: string
  }
}

export default async function ProductsOfSubcategoryPage({
  params,
  searchParams,
}: {
  params: Promise<PageProps["params"]>
  searchParams: Promise<PageProps["searchParams"]>
}) {
  const { category, subcategory } = await params
  const { manufacturer, letter, ailment } = await searchParams

  const formattedSubcategory = subcategory
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  const {
    products,
    manufacturers,
    categories,
    parentCategory,
    subcategoryInfo,
  } = await getProductsBySubcategory(
    category,
    subcategory,
    manufacturer,
    letter,
    ailment
  )

  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  )

  // Generate breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Products", item: "/products/all" },
    { name: parentCategory?.name || category, item: `/products/${category}` },
    {
      name: formattedSubcategory,
      item: `/products/${category}/${subcategory}`,
    },
  ])

  return (
    <div className="container mx-auto px-4 py-10">
      <JsonLd data={breadcrumbSchema} />
      <div className="mb-4 flex items-center text-sm text-gray-500">
        <Link href="/products/all" className="hover:text-brand">
          All Products
        </Link>
        <span className="mx-2">/</span>
        {parentCategory && (
          <>
            <Link href={`/products/${category}`} className="hover:text-brand">
              {parentCategory.name}
            </Link>
            <span className="mx-2">/</span>
          </>
        )}
        <span className="font-medium text-brand">{formattedSubcategory}</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        {formattedSubcategory}
      </h1>

      <div className="flex flex-col-reverse md:flex-row gap-8">
        <div className="w-full md:w-64 flex-shrink-0">
          <FilterSidebar
            manufacturers={manufacturers}
            alphabet={alphabet}
            categories={categories}
            currentCategory={category}
            currentSubcategory={subcategory}
            currentManufacturer={manufacturer}
            currentLetter={letter}
            currentAilment={ailment}
          />
        </div>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-lg text-gray-500">
                No products found in {formattedSubcategory}
                {manufacturer ? ` from manufacturer "${manufacturer}"` : ""}
                {letter ? ` starting with "${letter}"` : ""}
                {ailment ? ` for ailment "${ailment}"` : ""}
              </p>
            </div>
          ) : (
            <ProductList products={products} />
          )}
        </div>
      </div>
    </div>
  )
}
