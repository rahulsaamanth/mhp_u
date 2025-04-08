"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/formatters"

export type ProductVariant = {
  id: string
  potency: string
  packSize: number
  sellingPrice: number
  mrp: number
  discount: number
  discountType: string
  variantImage: string[]
}

type ProductCardProps = {
  id: string
  name: string
  form: string
  variants: ProductVariant[]
}

export const ProductCard = ({ id, name, form, variants }: ProductCardProps) => {
  // Only proceed if we have at least one variant
  if (!variants.length) return null

  const firstVariant = variants[0]
  const { sellingPrice, mrp, variantImage, discount, discountType } =
    firstVariant

  // Get first image or fallback
  const imageUrl = variantImage?.[0] || "/assets/hero1.webp"

  // Get all unique pack sizes and potencies for variant selector
  const packSizes = [...new Set(variants.map((v) => v.packSize))].sort(
    (a, b) => a - b
  )
  const potencies = [...new Set(variants.map((v) => v.potency))].filter(
    (p) => p !== "NONE"
  )

  const discountPercentage =
    discountType === "PERCENTAGE"
      ? discount
      : Math.round(((mrp - sellingPrice) / mrp) * 100)

  return (
    <div className="group relative h-auto flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow p-4">
      {/* Discount badge if any */}
      {discountPercentage > 0 && (
        <Badge className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600">
          {discountPercentage}% OFF
        </Badge>
      )}

      {/* Image */}
      <Link href={`/products/${id}`} className="relative ">
        <div className=" overflow-hidden">
          <Image
            src={imageUrl || "/assets/hero1.webp"}
            alt={name}
            width={200}
            height={200}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        <Link href={`/products/${id}`} className="flex-grow">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-brand transition-colors">
            {name}
          </h3>
        </Link>

        {/* Pack size and potency options */}
        <div className="mt-2 space-y-1">
          {packSizes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {packSizes.map((size) => (
                <Badge key={size} variant="outline" className="text-xs">
                  {size} {form.toLowerCase()}
                </Badge>
              ))}
            </div>
          )}

          {potencies.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {potencies.map((p) => (
                <Badge key={p} variant="secondary" className="text-xs">
                  {p}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Price */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-md font-medium text-gray-900">
              {formatCurrency(sellingPrice)}
            </p>
            {mrp > sellingPrice && (
              <p className="text-xs text-gray-500 line-through">
                MRP: {formatCurrency(mrp)}
              </p>
            )}
          </div>

          <Button size="sm" className="rounded-full p-2 h-8 w-8">
            <ShoppingBag className="h-4 w-4" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
