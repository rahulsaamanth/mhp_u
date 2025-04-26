import React from "react"

interface PriceDisplayProps {
  mrp: number
  sellingPrice: number
  discountType: string
  discount: number
  size?: "small" | "medium" | "large"
}

export default function PriceDisplay({
  mrp,
  sellingPrice,
  discountType,
  discount,
  size = "medium",
}: PriceDisplayProps) {
  // Calculate discount percentage for display
  const discountPercentage =
    discountType === "PERCENTAGE"
      ? discount
      : mrp > 0
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0

  // Determine text size based on the size prop
  const priceTextClass = {
    small: "text-base font-semibold",
    medium: "text-xl font-semibold",
    large: "text-2xl font-semibold",
  }[size]

  const originalTextClass = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  }[size]

  const discountTextClass = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  }[size]

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      {/* Current selling price */}
      <span className={`${priceTextClass} text-brand-foreground`}>
        ₹{sellingPrice.toFixed(2)}
      </span>

      {/* Original MRP (if different from selling price) */}
      {mrp > sellingPrice && (
        <span className={`${originalTextClass} text-gray-500 line-through`}>
          ₹{mrp.toFixed(2)}
        </span>
      )}

      {/* Discount percentage (if any) */}
      {discountPercentage > 0 && (
        <span className={`${discountTextClass} text-green-600 font-medium`}>
          {discountPercentage}% off
        </span>
      )}
    </div>
  )
}
