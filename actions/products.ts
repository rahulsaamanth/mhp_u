"use server"

import { executeRawQuery } from "@/db/db"

// Define types for the exported data
export interface Product {
  id: string
  name: string
  description?: string
  image_url?: string
  in_stock?: boolean
  price?: number
  sale_price?: number
  brand?: {
    name: string
  }
  category?: {
    name: string
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface Brand {
  id: string
  name: string
  slug: string
}

export interface Ailment {
  id: string
  name: string
  slug: string
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const result = await executeRawQuery<Product>(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        (SELECT pv.variantImage[1] FROM "ProductVariant" pv WHERE pv."productId" = p.id LIMIT 1) as image_url,
        (EXISTS (SELECT 1 FROM "ProductVariant" pv WHERE pv."productId" = p.id AND pv."stock" > 0)) as in_stock,
        (SELECT pv.mrp FROM "ProductVariant" pv WHERE pv."productId" = p.id LIMIT 1) as price,
        (SELECT pv."sellingPrice" FROM "ProductVariant" pv WHERE pv."productId" = p.id LIMIT 1) as sale_price,
        jsonb_build_object(
          'name', m.name
        ) as brand,
        jsonb_build_object(
          'name', c.name
        ) as category
      FROM "Product" p
      LEFT JOIN "Manufacturer" m ON p."manufacturerId" = m.id
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      WHERE p.id = $1 AND p.status = 'ACTIVE'
      `,
      [id]
    )

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

/**
 * Get all active products
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    return await executeRawQuery<Product>(
      `
      SELECT 
        p.id,
        p.name,
        (SELECT pv.variantImage[1] FROM "ProductVariant" pv WHERE pv."productId" = p.id LIMIT 1) as image_url
      FROM "Product" p
      WHERE p.status = 'ACTIVE'
      LIMIT 1000
      `
    )
  } catch (error) {
    console.error("Error fetching all products:", error)
    return []
  }
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  try {
    return await executeRawQuery<Category>(
      `
      SELECT 
        id,
        name,
        LOWER(REPLACE(name, ' ', '-')) as slug
      FROM "Category"
      WHERE depth = 0
      ORDER BY name
      `
    )
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

/**
 * Get all brands
 */
export async function getAllBrands(): Promise<Brand[]> {
  try {
    return await executeRawQuery<Brand>(
      `
      SELECT 
        id,
        name,
        LOWER(REPLACE(name, ' ', '-')) as slug
      FROM "Manufacturer"
      ORDER BY name
      `
    )
  } catch (error) {
    console.error("Error fetching brands:", error)
    return []
  }
}

/**
 * Get all ailments
 */
export async function getAllAilments(): Promise<Ailment[]> {
  try {
    return await executeRawQuery<Ailment>(
      `
      SELECT 
        id,
        name,
        LOWER(REPLACE(name, ' ', '-')) as slug
      FROM "Ailment"
      ORDER BY name
      `
    )
  } catch (error) {
    console.error("Error fetching ailments:", error)
    return []
  }
}

/**
 * Get category information by slug
 */
export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const result = await executeRawQuery<Category>(
      `
      SELECT 
        id,
        name,
        description,
        LOWER(REPLACE(name, ' ', '-')) as slug
      FROM "Category"
      WHERE LOWER(REPLACE(name, ' ', '-')) = LOWER($1)
      LIMIT 1
      `,
      [slug]
    )

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}

/**
 * Get subcategory information by parent category slug and subcategory slug
 */
export async function getSubcategory(
  categorySlug: string,
  subcategorySlug: string
): Promise<Category | null> {
  try {
    const result = await executeRawQuery<Category>(
      `
      SELECT 
        s.id,
        s.name,
        s.description,
        LOWER(REPLACE(s.name, ' ', '-')) as slug
      FROM "Category" s
      JOIN "Category" p ON s."parentId" = p.id
      WHERE LOWER(REPLACE(p.name, ' ', '-')) = LOWER($1)
        AND LOWER(REPLACE(s.name, ' ', '-')) = LOWER($2)
      LIMIT 1
      `,
      [categorySlug, subcategorySlug]
    )

    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error fetching subcategory:", error)
    return null
  }
}
