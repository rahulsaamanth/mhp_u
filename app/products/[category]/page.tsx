import { executeRawQuery } from "@/db/db"
import { ProductCardProps } from "@/components/product-card"
import ProductList from "../_components/product-list"
import FilterSidebar from "../_components/filter-sidebar"
import { redirect } from "next/navigation"
import Link from "next/link"

interface CategoryItem {
  id: string
  name: string
  path: string
  parentId: string | null
  depth: number
}

async function checkCategoryType(category: string): Promise<{
  isSubcategory: boolean
  parentCategory?: string
  subcategoryInfo?: CategoryItem
}> {
  const categoryInfo = await executeRawQuery<CategoryItem>(
    `
    SELECT 
      cat.id, 
      cat.name, 
      cat."parentId", 
      cat.depth, 
      cat.path,
      parent.name as "parentName"
    FROM "Category" cat
    LEFT JOIN "Category" parent ON cat."parentId" = parent.id
    WHERE LOWER(REPLACE(cat.name, ' ', '-')) = LOWER($1)
    LIMIT 1
    `,
    [category]
  )

  if (categoryInfo.length === 0) {
    return { isSubcategory: false }
  }

  const catInfo = categoryInfo[0]
  const isSubcategory = catInfo.depth > 0 && catInfo.parentId !== null
  let parentCategory

  if (isSubcategory) {
    const parentInfo = await executeRawQuery<{ name: string }>(
      `
      SELECT name
      FROM "Category"
      WHERE id = $1
      LIMIT 1
      `,
      [catInfo.parentId]
    )

    if (parentInfo.length > 0) {
      parentCategory = parentInfo[0].name.toLowerCase().replace(/\s+/g, "-")
    }
  }

  return {
    isSubcategory,
    parentCategory,
    subcategoryInfo: isSubcategory ? catInfo : undefined,
  }
}

async function getProductsByCategory(
  category: string,
  manufacturer?: string,
  letter?: string,
  ailment?: string
): Promise<{
  products: ProductCardProps[]
  manufacturers: string[]
  categories: CategoryItem[]
  currentCategoryInfo: CategoryItem | null
}> {
  if (category.toLowerCase() === "all") {
    let conditions = `p.status = 'ACTIVE'`
    const params: any[] = []

    if (letter) {
      conditions += ` AND p.name ILIKE $${params.length + 1}`
      params.push(`${letter}%`)
    }

    if (manufacturer) {
      conditions += ` AND m.name = $${params.length + 1}`
      params.push(manufacturer)
    }

    if (ailment) {
      const normalizedAilment = ailment.replace(/[^a-zA-Z0-9]/g, "")
      conditions += ` AND EXISTS (
        SELECT 1 FROM unnest(p.tags) tag WHERE tag ILIKE $${params.length + 1}
      )`
      params.push(`%${normalizedAilment}%`)
    }

    const products = await executeAllProductsQuery(conditions, params)
    const manufacturers = await executeManufacturersQuery(conditions, params)
    const categories = await executeAllCategoriesQuery()

    return {
      products,
      manufacturers: manufacturers.map((m) => m.name),
      categories,
      currentCategoryInfo: null,
    }
  }

  const categoryInfo = await executeRawQuery<CategoryItem>(
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
    [category]
  )

  const currentCategoryInfo = categoryInfo.length > 0 ? categoryInfo[0] : null

  let conditions = ``
  const params: any[] = []

  if (currentCategoryInfo) {
    if (currentCategoryInfo.depth === 0) {
      conditions = `(c.id = $1 OR c."parentId" = $1)`
      params.push(currentCategoryInfo.id)
    } else {
      conditions = `c.id = $1`
      params.push(currentCategoryInfo.id)
    }
  } else {
    conditions = `LOWER(REPLACE(c.name, ' ', '-')) = LOWER($1)`
    params.push(category)
  }

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
      SELECT 1 FROM unnest(p.tags) tag WHERE tag ILIKE $${params.length + 1}
    )`
    params.push(`%${normalizedAilment}%`)
  }

  const products = await executeProductsQuery(conditions, params)
  const manufacturers = await executeManufacturersQuery(conditions, params)
  const categories = await executeAllCategoriesQuery()

  return {
    products,
    manufacturers: manufacturers.map((m) => m.name),
    categories,
    currentCategoryInfo,
  }
}

async function executeProductsQuery(
  conditions: string,
  params: any[]
): Promise<ProductCardProps[]> {
  return await executeRawQuery<ProductCardProps>(
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
      JOIN "Manufacturer" m ON p."manufacturerId" = m."id"
      WHERE ${conditions}
      AND p.status = 'ACTIVE'
      GROUP BY p."id", c."name", m."name"
      ORDER BY p.name ASC
    )
    SELECT * FROM CategoryProducts
  `,
    params
  )
}

async function executeAllProductsQuery(
  conditions: string,
  params: any[]
): Promise<ProductCardProps[]> {
  return await executeRawQuery<ProductCardProps>(
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
      JOIN "Manufacturer" m ON p."manufacturerId" = m."id"
      WHERE ${conditions}
      GROUP BY p."id", c."name", m."name"
      ORDER BY p.name ASC
    )
    SELECT * FROM CategoryProducts
  `,
    params
  )
}

async function executeManufacturersQuery(
  conditions: string,
  params: any[]
): Promise<{ name: string }[]> {
  return await executeRawQuery<{ name: string }>(
    `
    SELECT DISTINCT m.name
    FROM "Product" p
    JOIN "Category" c ON p."categoryId" = c."id"
    JOIN "Manufacturer" m ON p."manufacturerId" = m."id"
    WHERE ${conditions}
    ORDER BY m.name ASC
    `,
    params
  )
}

async function executeAllCategoriesQuery(): Promise<CategoryItem[]> {
  return await executeRawQuery<CategoryItem>(
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
}

interface PageProps {
  params: { category: string }
  searchParams: {
    manufacturer?: string
    letter?: string
    page?: string
    ailment?: string
  }
}

export default async function ProductsOfCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<PageProps["params"]>
  searchParams: Promise<PageProps["searchParams"]>
}) {
  const { category } = await params
  const { manufacturer, letter, ailment } = await searchParams

  const { isSubcategory, parentCategory, subcategoryInfo } =
    await checkCategoryType(category)

  if (isSubcategory && parentCategory) {
    let redirectPath = `/products/${parentCategory}/${category}`

    const searchParamsEntries = Object.entries({
      manufacturer,
      letter,
      ailment,
    }).filter(([_, value]) => !!value)

    if (searchParamsEntries.length > 0) {
      const queryString = new URLSearchParams(
        searchParamsEntries.map(([key, value]) => [key, value as string])
      ).toString()
      redirectPath += `?${queryString}`
    }

    redirect(redirectPath)
  }

  const { products, manufacturers, categories, currentCategoryInfo } =
    await getProductsByCategory(category, manufacturer, letter, ailment)

  const formattedCategory =
    currentCategoryInfo?.name ||
    category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  )

  const subcategories =
    currentCategoryInfo && currentCategoryInfo.depth === 0
      ? categories.filter((cat) => cat.parentId === currentCategoryInfo.id)
      : []

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Breadcrumbs navigation */}
      <div className="mb-4 flex items-center text-sm text-gray-500">
        <Link href="/products/all" className="hover:text-brand">
          All Products
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-brand">{formattedCategory}</span>
      </div>

      {/* <h1 className="text-2xl md:text-3xl font-bold mb-6">
        {formattedCategory}
      </h1> */}

      {/* Display subcategories if this is a parent category */}
      {/* {subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-3">Subcategories:</h2>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((subcat) => {
              const subcatSlug = subcat.name.toLowerCase().replace(/\s+/g, "-")
              return (
                <Link
                  key={subcat.id}
                  href={`/products/${category}/${subcatSlug}`}
                  className="inline-block px-4 py-2 bg-gray-100 hover:bg-brand hover:text-white rounded-md transition-colors"
                >
                  {subcat.name}
                </Link>
              )
            })}
          </div>
        </div>
      )} */}

      <div className="flex flex-col-reverse md:flex-row gap-8">
        {/* Sidebar with filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <FilterSidebar
            manufacturers={manufacturers}
            alphabet={alphabet}
            categories={categories}
            currentCategory={category}
            currentManufacturer={manufacturer}
            currentLetter={letter}
            currentAilment={ailment}
          />
        </div>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-lg text-gray-500">
                No products found in {formattedCategory}
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
