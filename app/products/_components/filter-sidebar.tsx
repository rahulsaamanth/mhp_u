"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

// Define category structure to match database
interface CategoryItem {
  id: string
  name: string
  path: string
  parentId: string | null
  depth: number
  children?: CategoryItem[]
}

interface FilterSidebarProps {
  manufacturers: string[]
  alphabet: string[]
  categories: string[] | CategoryItem[]
  currentCategory: string
  currentSubcategory?: string
  currentManufacturer?: string
  currentLetter?: string
  currentAilment?: string
}

export default function FilterSidebar({
  manufacturers,
  alphabet,
  categories,
  currentCategory,
  currentSubcategory,
  currentManufacturer,
  currentLetter,
  currentAilment,
}: FilterSidebarProps) {
  // Use pathname to determine active category
  const pathname = usePathname()
  const [activeAccordions, setActiveAccordions] = useState<string[]>([
    "categories",
    "manufacturer",
    "alphabet",
  ])

  // Store the full list of manufacturers to ensure it's always available
  const [allManufacturers, setAllManufacturers] =
    useState<string[]>(manufacturers)

  // Update allManufacturers if the manufacturers prop changes
  useEffect(() => {
    // If new manufacturers are provided and they're not empty, update our local state
    if (manufacturers.length > 0) {
      setAllManufacturers((prev) => {
        // Merge the new manufacturers with existing ones and remove duplicates
        const combined = [...prev, ...manufacturers]
        return [...new Set(combined)].sort() // Remove duplicates and sort
      })
    }

    // If currentManufacturer exists but isn't in our list, add it
    if (
      currentManufacturer &&
      !allManufacturers.includes(currentManufacturer)
    ) {
      setAllManufacturers((prev) => [...prev, currentManufacturer].sort())
    }
  }, [manufacturers, currentManufacturer])

  // Process categories into hierarchical structure
  const organizeCategories = () => {
    // If categories is just an array of strings, convert to a flat structure first
    let categoryItems: CategoryItem[] = []

    if (typeof categories[0] === "string") {
      // This is the old format, just strings
      categoryItems = (categories as string[]).map((name) => ({
        id: name,
        name: name,
        path: name.toLowerCase().replace(/\s+/g, "-"),
        parentId: null,
        depth: 0,
      }))
      return categoryItems
    } else {
      // Already in the correct format
      return categories as CategoryItem[]
    }
  }

  const organizedCategories = organizeCategories()

  // Get parent categories (depth 0)
  const parentCategories = organizedCategories.filter((cat) => cat.depth === 0)

  // Get subcategories by parent ID
  const getSubcategories = (parentId: string) => {
    return organizedCategories.filter((cat) => cat.parentId === parentId)
  }

  // Helper function to get the formatted category URL
  const getCategoryUrl = (category: CategoryItem) => {
    if (category.depth === 0) {
      // Parent category
      const slug = category.name.toLowerCase().replace(/\s+/g, "-")
      return `/products/${slug}`
    } else {
      // Subcategory - need parent category for URL
      const parentCategory = getParentCategory(category)
      const parentSlug = parentCategory
        ? parentCategory.name.toLowerCase().replace(/\s+/g, "-")
        : ""
      const subcategorySlug = category.name.toLowerCase().replace(/\s+/g, "-")

      return `/products/${parentSlug}/${subcategorySlug}`
    }
  }

  // Helper to get parent category
  const getParentCategory = (category: CategoryItem): CategoryItem | null => {
    if (!category.parentId) return null
    return organizedCategories.find((c) => c.id === category.parentId) || null
  }

  // Helper function to build URLs with the correct parameters
  const getFilterUrl = (params: {
    manufacturer?: string
    letter?: string
    ailment?: string
  }) => {
    const searchParams = new URLSearchParams()

    // Only add parameters that have values
    if (params.manufacturer)
      searchParams.set("manufacturer", params.manufacturer)
    if (params.letter) searchParams.set("letter", params.letter)
    if (params.ailment) searchParams.set("ailment", params.ailment)

    const queryString = searchParams.toString()

    // Use different base URL depending on if we're in a subcategory or not
    const baseUrl = currentSubcategory
      ? `/products/${currentCategory}/${currentSubcategory}`
      : `/products/${currentCategory}`

    return `${baseUrl}${queryString ? `?${queryString}` : ""}`
  }

  // Check if a category is currently active based on pathname
  const isCategoryActive = (category: CategoryItem) => {
    const categoryUrl = getCategoryUrl(category)

    // For parent categories: either exact match or starts with (for when in a subcategory)
    if (category.depth === 0) {
      // We want to highlight the parent category even when a subcategory is selected
      // Check 1: Exact match for parent category URL
      if (pathname === categoryUrl) return true

      // Check 2: Check if we're in a subcategory of this parent
      if (pathname.startsWith(`${categoryUrl}/`)) return true
    }
    // For subcategories: exact match
    else {
      return pathname === categoryUrl
    }

    return false
  }

  // Check if a subcategory is active
  const isSubcategoryActive = (subcategory: CategoryItem) => {
    const subcategoryUrl = getCategoryUrl(subcategory)

    // Direct URL match
    if (pathname === subcategoryUrl) return true

    // Also check by name matching in the URL
    // This handles cases where URL structure might be slightly different
    const subcatName = subcategory.name.toLowerCase().replace(/\s+/g, "-")
    const pathParts = pathname.split("/")
    const lastPathPart = pathParts[pathParts.length - 1]

    return lastPathPart === subcatName
  }

  // Check if a parent has any active subcategory
  const hasActiveSubcategory = (parentId: string) => {
    const subcategories = getSubcategories(parentId)
    return subcategories.some((subcat) => isSubcategoryActive(subcat))
  }

  // Automatically expand parent categories that have the active subcategory
  useEffect(() => {
    // Make sure categories are expanded if we're on a subcategory page
    const pathParts = pathname.split("/")
    if (pathParts.length >= 4 && pathParts[1] === "products") {
      setActiveAccordions((prev) => {
        if (!prev.includes("categories")) {
          return [...prev, "categories"]
        }
        return prev
      })
    }
  }, [pathname])

  return (
    <Card className="p-4 sticky top-24">
      <h2 className="font-semibold text-lg mb-2">Filter Options</h2>

      <Accordion
        type="multiple"
        value={activeAccordions}
        onValueChange={setActiveAccordions}
        className="space-y-4"
      >
        {/* Categories Filter */}
        {organizedCategories.length > 0 && (
          <AccordionItem value="categories" className="border px-4 rounded-md">
            <AccordionTrigger className="py-2 hover:no-underline">
              Categories
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-2 py-2 max-h-52 overflow-y-auto">
                <Link
                  href="/products/all"
                  className={cn(
                    "text-sm hover:text-brand rounded px-2 py-1 transition-colors active:scale-95 active:bg-brand/5",
                    pathname === "/products/all" && "font-semibold text-brand"
                  )}
                >
                  All Products
                </Link>

                {parentCategories.map((category) => {
                  const subcategories = getSubcategories(category.id)
                  const isActive = isCategoryActive(category)
                  const parentHasActiveSubcategory = hasActiveSubcategory(
                    category.id
                  )

                  // Always show subcategories if parent is active or has active subcategory
                  const showSubcategories =
                    subcategories.length > 0 &&
                    (isActive || parentHasActiveSubcategory)

                  return (
                    <div key={category.id} className="space-y-1">
                      <Link
                        href={getCategoryUrl(category)}
                        className={cn(
                          "text-sm hover:text-brand rounded px-2 py-1 transition-colors active:scale-95 active:bg-brand/5",
                          isActive && "font-semibold text-brand"
                        )}
                      >
                        {category.name}
                      </Link>

                      {(showSubcategories || subcategories.length > 0) && (
                        <div className="ml-3 pl-2 border-l border-gray-200 space-y-1">
                          {subcategories.map((subcat) => {
                            const isSubActive = isSubcategoryActive(subcat)

                            return (
                              <Link
                                key={subcat.id}
                                href={getCategoryUrl(subcat)}
                                className={cn(
                                  "text-sm hover:text-brand flex items-center rounded px-2 py-1 transition-colors active:scale-95 active:bg-brand/5",
                                  isSubActive && "font-semibold text-brand"
                                )}
                              >
                                <ChevronRight className="h-3 w-3 mr-1" />
                                {subcat.name}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Manufacturer Filter */}
        <AccordionItem value="manufacturer" className="border px-4 rounded-md">
          <AccordionTrigger className="py-2 hover:no-underline">
            Manufacturer
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2 py-2 max-h-52 overflow-y-auto">
              <Link
                href={getFilterUrl({
                  letter: currentLetter,
                  ailment: currentAilment,
                })}
                className={cn(
                  "text-sm hover:text-brand rounded px-2 py-1 transition-colors active:scale-95 active:bg-brand/5",
                  !currentManufacturer && "font-semibold text-brand"
                )}
              >
                All
              </Link>
              {allManufacturers.map((name) => (
                <Link
                  key={name}
                  href={getFilterUrl({
                    manufacturer: name,
                    letter: currentLetter,
                    ailment: currentAilment,
                  })}
                  className={cn(
                    "text-sm hover:text-brand rounded px-2 py-1 transition-colors active:scale-95 active:bg-brand/5",
                    currentManufacturer === name && "font-semibold text-brand"
                  )}
                >
                  {name}
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Alphabet Filter */}
        <AccordionItem
          value="alphabet"
          className="outline outline-gray-200 px-4 rounded-md"
        >
          <AccordionTrigger className="py-2 hover:no-underline">
            Start With Letter
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2 py-2">
              <Link
                href={getFilterUrl({
                  manufacturer: currentManufacturer,
                  ailment: currentAilment,
                })}
                className="text-sm hover:text-brand transition-colors"
              >
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer rounded-sm transition-colors active:scale-95 active:bg-brand/5",
                    !currentLetter && "bg-brand text-white"
                  )}
                >
                  All
                </Badge>
              </Link>

              {alphabet.map((letter) => (
                <Link
                  key={letter}
                  href={getFilterUrl({
                    manufacturer: currentManufacturer,
                    letter,
                    ailment: currentAilment,
                  })}
                  className="text-sm hover:text-brand transition-colors"
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "cursor-pointer rounded-sm transition-colors active:scale-95 active:bg-brand/5",
                      currentLetter === letter && "bg-brand text-white"
                    )}
                  >
                    {letter}
                  </Badge>
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Show Applied Filters */}
      {(currentManufacturer || currentLetter || currentAilment) && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Applied Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {currentManufacturer && (
              <Badge variant="secondary" className="flex gap-1 items-center">
                {currentManufacturer}
                <Link
                  href={getFilterUrl({
                    letter: currentLetter,
                    ailment: currentAilment,
                  })}
                  className="rounded-full"
                >
                  <span className="ml-1 cursor-pointer hover:bg-gray-200 rounded-full w-4 h-4 inline-flex items-center justify-center active:bg-gray-300">
                    ×
                  </span>
                </Link>
              </Badge>
            )}
            {currentLetter && (
              <Badge variant="secondary" className="flex gap-1 items-center">
                Starts with: {currentLetter}
                <Link
                  href={getFilterUrl({
                    manufacturer: currentManufacturer,
                    ailment: currentAilment,
                  })}
                  className="rounded-full"
                >
                  <span className="ml-1 cursor-pointer hover:bg-gray-200 rounded-full w-4 h-4 inline-flex items-center justify-center active:bg-gray-300">
                    ×
                  </span>
                </Link>
              </Badge>
            )}
            {currentAilment && (
              <Badge variant="secondary" className="flex gap-1 items-center">
                Ailment:{" "}
                {currentAilment
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
                <Link
                  href={getFilterUrl({
                    manufacturer: currentManufacturer,
                    letter: currentLetter,
                  })}
                  className="rounded-full"
                >
                  <span className="ml-1 cursor-pointer hover:bg-gray-200 rounded-full w-4 h-4 inline-flex items-center justify-center active:bg-gray-300">
                    ×
                  </span>
                </Link>
              </Badge>
            )}
          </div>
          {(currentManufacturer || currentLetter || currentAilment) && (
            <Link
              href={
                currentSubcategory
                  ? `/products/${currentCategory}/${currentSubcategory}`
                  : `/products/${currentCategory}`
              }
              className="text-sm text-brand mt-2 inline-block hover:underline rounded px-2 py-1"
            >
              Clear All Filters
            </Link>
          )}
        </div>
      )}
    </Card>
  )
}
