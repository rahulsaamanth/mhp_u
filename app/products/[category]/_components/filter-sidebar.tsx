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

interface FilterSidebarProps {
  manufacturers: string[]
  alphabet: string[]
  categories: string[]
  currentCategory: string
  currentManufacturer?: string
  currentLetter?: string
  currentAilment?: string
}

export default function FilterSidebar({
  manufacturers,
  alphabet,
  categories,
  currentCategory,
  currentManufacturer,
  currentLetter,
  currentAilment,
}: FilterSidebarProps) {
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
    return `/products/${currentCategory}${queryString ? `?${queryString}` : ""}`
  }

  // Helper function to get the formatted category URL
  const getCategoryUrl = (name: string) => {
    // Use lowercase and replace spaces with dashes
    return `/products/${name.toLowerCase().replace(/\s+/g, "-")}`
  }

  return (
    <Card className="p-4 sticky top-24">
      <h2 className="font-semibold text-lg mb-2">Filter Options</h2>

      <Accordion
        type="multiple"
        defaultValue={["categories", "manufacturer", "alphabet"]}
        className="space-y-4"
      >
        {/* Categories Filter */}
        {categories.length > 0 && (
          <AccordionItem value="categories" className="border px-4 rounded-md">
            <AccordionTrigger className="py-2 hover:no-underline">
              Categories
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col space-y-2 py-2 max-h-52 overflow-y-auto">
                {categories.map((name) => (
                  <Link
                    key={name}
                    href={getCategoryUrl(name)}
                    className={cn(
                      "text-sm hover:text-brand",
                      currentCategory ===
                        name.toLowerCase().replace(/\s+/g, "-") &&
                        "font-semibold text-brand"
                    )}
                  >
                    {name}
                  </Link>
                ))}
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
                })}
                className={cn(
                  "text-sm hover:text-brand",
                  !currentManufacturer && "font-semibold text-brand"
                )}
              >
                All
              </Link>
              {manufacturers.map((name) => (
                <Link
                  key={name}
                  href={getFilterUrl({
                    manufacturer: name,
                    letter: currentLetter,
                  })}
                  className={cn(
                    "text-sm hover:text-brand",
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
                })}
                className={
                  !currentLetter
                    ? "bg-brand text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }
              >
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer rounded-sm",
                    !currentLetter && "bg-brand text-white border-brand"
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
                  })}
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "cursor-pointer rounded-sm",
                      currentLetter === letter &&
                        "bg-brand text-white border-brand"
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
                >
                  <span className="ml-1 cursor-pointer">×</span>
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
                >
                  <span className="ml-1 cursor-pointer">×</span>
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
                >
                  <span className="ml-1 cursor-pointer">×</span>
                </Link>
              </Badge>
            )}
          </div>
          {(currentManufacturer || currentLetter || currentAilment) && (
            <Link
              href={`/products/${currentCategory}`}
              className="text-sm text-brand mt-2 inline-block hover:underline"
            >
              Clear All Filters
            </Link>
          )}
        </div>
      )}
    </Card>
  )
}
