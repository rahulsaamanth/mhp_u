"use client"

import { AddToCartButton } from "@/components/add-cart"
import { Button } from "@/components/ui/button"
import { QuantitySelector } from "@/components/ui/quantity-selector"
import Image from "next/image"
import { useEffect, useState, useMemo } from "react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"

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
  inventory: {
    storeId: string
    stock: number
  }[]
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
  const safeVariants = useMemo(
    () => (Array.isArray(variants) ? variants : []),
    [variants]
  )
  const firstVariant = safeVariants.length > 0 ? safeVariants[0] : null

  const [selectedPotency, setSelectedPotency] = useState<string>(
    firstVariant?.potency || ""
  )
  const [selectedPackSize, setSelectedPackSize] = useState<string>(
    firstVariant?.packSize || ""
  )
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    firstVariant
  )
  const [quantity, setQuantity] = useState<number>(1)

  const allUniquePotencies = Array.from(
    new Set(safeVariants.map((v) => v.potency))
  ).filter((p) => p !== "NONE")

  const allUniquePackSizes = Array.from(
    new Set(safeVariants.map((v) => v.packSize))
  )

  const availablePackSizesForPotency = safeVariants
    .filter((v) => v.potency === selectedPotency)
    .map((v) => v.packSize)

  const availablePotenciesForPackSize = safeVariants
    .filter((v) => v.packSize === selectedPackSize)
    .map((v) => v.potency)

  useEffect(() => {
    const newVariant = safeVariants.find(
      (v) => v.potency === selectedPotency && v.packSize === selectedPackSize
    )

    if (newVariant) {
      setSelectedVariant(newVariant)
    } else if (availablePackSizesForPotency.length > 0) {
      setSelectedPackSize(availablePackSizesForPotency[0])
    } else if (availablePotenciesForPackSize.length > 0) {
      setSelectedPotency(availablePotenciesForPackSize[0])
    }
  }, [
    selectedPotency,
    selectedPackSize,
    safeVariants,
    availablePackSizesForPotency,
    availablePotenciesForPackSize,
  ])

  const discountPercentage = selectedVariant
    ? selectedVariant.discountType === "PERCENTAGE"
      ? selectedVariant.discount
      : Math.round(
          ((selectedVariant.mrp - selectedVariant.sellingPrice) /
            selectedVariant.mrp) *
            100
        )
    : 0

  const stocks = selectedVariant?.inventory.map((data) => {
    return data.stock
  })

  const totalStock = stocks?.reduce((acc, stock) => {
    return acc + stock
  }, 0)

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
                        src={"/placeholder.png"}
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
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">{`${productName}`}</h1>

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

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Choose Variant</h2>

          {allUniquePotencies.length > 0 ? (
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
                        value={potency || ""}
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
          ) : (
            <div className="text-sm text-gray-500">
              No potency options available
            </div>
          )}

          {allUniquePackSizes.length > 0 ? (
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
                        value={packSize || ""}
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
          ) : (
            <div className="text-sm text-gray-500">
              No pack size options available
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity:</label>
            <QuantitySelector
              initialQuantity={quantity}
              min={1}
              max={totalStock ? Math.min(10, totalStock) : 10}
              onChange={setQuantity}
            />
          </div>
        </div>

        {selectedVariant && (
          <>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold">
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
                quantity={quantity}
                disabled={!hasStock}
              />

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
                quantity={quantity}
                disabled={!hasStock}
                buyNow={true}
              />
            </div>

            <div className="mt-4 space-y-2">
              {selectedVariant && (
                <div className="flex items-start gap-2">
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 ${
                      (totalStock || 0) > 10
                        ? "bg-brand"
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
