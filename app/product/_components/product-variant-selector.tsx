"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "@/components/add-cart"

interface Variant {
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
  stockByLocation: Record<string, number>
  discontinued: boolean
}

interface ProductVariantSelectorProps {
  productId: string
  productName: string
  variants: Variant[]
  unit: string
  category?: string
  manufacturer?: string
}

export default function ProductVariantSelector({
  productId,
  productName,
  variants,
  unit,
  category = "Health Supplements",
  manufacturer = "MHP Pharmaceuticals",
}: ProductVariantSelectorProps) {
  // Ensure variants is an array before using it in useState initializers
  const safeVariants = Array.isArray(variants) ? variants : []
  const firstVariant = safeVariants.length > 0 ? safeVariants[0] : null

  const [selectedPotency, setSelectedPotency] = useState<string>(
    firstVariant?.potency || "NONE"
  )
  const [selectedPackSize, setSelectedPackSize] = useState<string>(
    firstVariant?.packSize || ""
  )
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    firstVariant
  )
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Get ALL unique potencies and pack sizes
  const allUniquePotencies = Array.from(
    new Set(safeVariants.map((v) => v.potency))
  ).filter((p) => p !== "NONE")

  const allUniquePackSizes = Array.from(
    new Set(safeVariants.map((v) => v.packSize))
  )

  // Get pack sizes available for the selected potency
  const availablePackSizesForPotency = safeVariants
    .filter((v) => v.potency === selectedPotency)
    .map((v) => v.packSize)

  // Get potencies available for the selected pack size
  const availablePotenciesForPackSize = safeVariants
    .filter((v) => v.packSize === selectedPackSize)
    .map((v) => v.potency)

  // Update selected variant when potency or pack size changes
  useEffect(() => {
    const newVariant = safeVariants.find(
      (v) => v.potency === selectedPotency && v.packSize === selectedPackSize
    )

    if (newVariant) {
      setSelectedVariant(newVariant)
      setActiveImageIndex(0)
    } else if (availablePackSizesForPotency.length > 0) {
      // If current selection is invalid, select first available pack size for this potency
      setSelectedPackSize(availablePackSizesForPotency[0])
    } else if (availablePotenciesForPackSize.length > 0) {
      // If no pack sizes available for this potency, select first available potency for the pack size
      setSelectedPotency(availablePotenciesForPackSize[0])
    }
  }, [
    selectedPotency,
    selectedPackSize,
    safeVariants,
    availablePackSizesForPotency,
    availablePotenciesForPackSize,
  ])

  // Calculate discount percentage for display
  const discountPercentage = selectedVariant
    ? selectedVariant.discountType === "PERCENTAGE"
      ? selectedVariant.discount
      : Math.round(
          ((selectedVariant.mrp - selectedVariant.sellingPrice) /
            selectedVariant.mrp) *
            100
        )
    : 0

  // Check if any stock exists across locations
  const hasStock = selectedVariant
    ? Object.values(selectedVariant.stockByLocation || {}).some(
        (stock) => stock > 0
      )
    : false

  const totalStockQuantity = Object.values(
    selectedVariant?.stockByLocation || {}
  ).reduce((total, stock) => total + stock, 0)

  console.log(totalStockQuantity)

  if (!safeVariants.length) {
    return (
      <div className="flex justify-center items-center py-10">
        <p>No product variants available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <div className="aspect-square relative border rounded-lg overflow-hidden bg-white">
          <Image
            src={
              selectedVariant?.variantImage?.[activeImageIndex] ||
              "/assets/hero1.webp"
            }
            alt={productName}
            width={500}
            height={500}
            className="object-contain p-8 size-full"
            priority
          />

          {/* Thumbnail images */}
          {selectedVariant?.variantImage &&
            selectedVariant.variantImage.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                {selectedVariant.variantImage.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-10 h-10 relative border rounded-lg overflow-hidden bg-white ${
                      activeImageIndex === idx ? "ring-2 ring-brand" : ""
                    }`}
                  >
                    <Image
                      src={
                        img ||
                        firstVariant?.variantImage?.[0] ||
                        "/assets/placeholder.png"
                      }
                      alt={`${productName} view ${idx + 1}`}
                      width={500}
                      height={500}
                      className="object-contain size-full p-8"
                    />
                  </button>
                ))}
              </div>
            )}
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        {/* Product Information Section */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">{productName}</h1>

          <div className="flex flex-col gap-1 text-base text-gray-600">
            {category && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Category:</span>
                <span>{category}</span>
              </div>
            )}
            {manufacturer && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Manufacturer:</span>
                <span>{manufacturer}</span>
              </div>
            )}
            {selectedVariant?.sku && (
              <div className="flex items-center gap-2">
                <span className="font-medium">SKU:</span>
                <span>{selectedVariant.sku}</span>
              </div>
            )}
          </div>
        </div>

        {/* Variant Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Choose Variant</h2>

          {/* Potency Selection */}
          {allUniquePotencies.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Potency:</label>
              <div className="flex flex-wrap gap-2">
                {allUniquePotencies.map((potency) => {
                  const isAvailable = selectedPackSize
                    ? availablePotenciesForPackSize.includes(potency)
                    : true

                  return (
                    <label
                      key={potency}
                      className={`cursor-pointer ${
                        !isAvailable ? "opacity-50" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="potency"
                        value={potency}
                        checked={selectedPotency === potency}
                        onChange={() => setSelectedPotency(potency)}
                        disabled={!isAvailable}
                        className="sr-only peer"
                      />
                      <div
                        className={`peer-checked:bg-brand peer-checked:text-white border border-gray-300 rounded px-4 py-2 text-sm ${
                          !isAvailable
                            ? "cursor-not-allowed bg-gray-100"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {potency}
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {/* Pack Size Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Pack Size:</label>
            <div className="flex flex-wrap gap-2">
              {allUniquePackSizes.map((packSize) => {
                const isAvailable = selectedPotency
                  ? availablePackSizesForPotency.includes(packSize)
                  : true

                return (
                  <label
                    key={packSize}
                    className={`cursor-pointer ${
                      !isAvailable ? "opacity-50" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="packSize"
                      value={packSize}
                      checked={selectedPackSize === packSize}
                      onChange={() => setSelectedPackSize(packSize)}
                      disabled={!isAvailable}
                      className="sr-only peer"
                    />
                    <div
                      className={`peer-checked:bg-brand peer-checked:text-white border border-gray-300 rounded px-4 py-2 text-sm ${
                        !isAvailable
                          ? "cursor-not-allowed bg-gray-100"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {packSize}{" "}
                      {unit.replace("(s)", "").replace("TABLETS", "PILLS")}
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Price and Add to Cart */}
        {selectedVariant && (
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-brand">
                    ₹{selectedVariant.sellingPrice}
                  </span>
                  {selectedVariant.discount > 0 && (
                    <span className="text-xl text-gray-500 line-through">
                      ₹{selectedVariant.mrp}
                    </span>
                  )}
                  {selectedVariant.discount > 0 && (
                    <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      {discountPercentage}% OFF
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <AddToCartButton
                    productId={productId}
                    variantId={selectedVariant.id}
                    name={productName}
                    image={selectedVariant.variantImage[0]}
                    price={selectedVariant.sellingPrice}
                    potency={
                      selectedVariant.potency !== "NONE"
                        ? selectedVariant.potency
                        : undefined
                    }
                    packSize={selectedVariant.packSize}
                    disabled={!hasStock}
                  />

                  <Button
                    variant="outline"
                    className="py-5 px-4"
                    disabled={!hasStock}
                  >
                    Buy Now
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  {/* Stock availability indicator */}
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        totalStockQuantity > 10
                          ? "bg-green-500"
                          : totalStockQuantity > 0
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                    />
                    <p className="text-sm">
                      {totalStockQuantity > 10
                        ? "In stock"
                        : totalStockQuantity > 0
                        ? `Low stock (${totalStockQuantity} left)`
                        : "Out of stock"}
                    </p>
                  </div>

                  {/* Delivery information */}
                  {totalStockQuantity > 0 && (
                    <div className="flex items-start gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <p className="text-sm">
                        Delivery: Usually dispatched within 24 hours
                      </p>
                    </div>
                  )}
                </div>
              </>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
