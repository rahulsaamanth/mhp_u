"use client"

import { AddToCartButton } from "@/components/add-cart"
import { Button } from "@/components/ui/button"
import { StockByLocation } from "@rahulsaamanth/mhp-schema"
import Image from "next/image"
import { useEffect, useState, useMemo } from "react"

// Import shadcn carousel components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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
  stockByLocation: StockByLocation[]
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
  const safeVariants = useMemo(
    () => (Array.isArray(variants) ? variants : []),
    [variants]
  )
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

  const stocks = selectedVariant?.stockByLocation.map((data) => {
    return data.stock
  })

  const totalStock = stocks?.reduce((acc, stock) => {
    return acc + stock
  }, 0)

  // Check if any stock exists across locations
  const hasStock = totalStock && totalStock > 0

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
        {selectedVariant?.variantImage &&
        selectedVariant.variantImage.length > 0 ? (
          <div className="w-full max-w-md mx-auto">
            <Carousel className="w-full">
              <CarouselContent>
                {selectedVariant.variantImage.map((img, idx) => (
                  <CarouselItem key={idx}>
                    <div className="aspect-square relative border rounded-lg overflow-hidden bg-white flex items-center justify-center p-4">
                      <Image
                        src={img || "/assets/hero1.webp"}
                        alt={`${productName} - view ${idx + 1}`}
                        width={320}
                        height={320}
                        className="object-contain max-h-full max-w-full"
                        priority={idx === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        ) : (
          <div className="aspect-square relative border rounded-lg overflow-hidden bg-white max-w-md mx-auto">
            <Image
              src="/assets/hero1.webp"
              alt={productName}
              width={320}
              height={320}
              className="object-contain p-4 size-full"
              priority
            />
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-6">
        {/* Product Information Section */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">{`${manufacturer} ${productName}`}</h1>

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
                        className={`border border-gray-300 rounded px-4 py-2 text-sm ${
                          selectedPotency === potency
                            ? "bg-brand text-white"
                            : !isAvailable
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
                      className={`border border-gray-300 rounded px-4 py-2 text-sm ${
                        selectedPackSize === packSize
                          ? "bg-brand text-white"
                          : !isAvailable
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
                variant="default"
                className="rounded-none py-5 px-4 md:px-3 xl:px-4 bg-brand hover:bg-brand/90 text-white text-sm font-medium cursor-pointer"
              >
                Buy Now
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              {/* Stock availability indicator */}
              {selectedVariant && (
                <div className="flex items-start gap-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      (totalStock || 0) > 10
                        ? "bg-green-500"
                        : (totalStock || 0) > 0
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  />
                  <p className="text-sm">
                    {(totalStock || 0) > 10
                      ? "In stock"
                      : (totalStock || 0) > 0
                      ? `Low stock (${totalStock || 0} left)`
                      : "Out of stock"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
