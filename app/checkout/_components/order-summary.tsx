"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { CartItem } from "@/store/cart"
import { CouponData, validateCoupon } from "../_lib/actions"
import { formatCurrency } from "@/lib/formatters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { AlertCircle, CheckCircle2, Tag, PenSquare } from "lucide-react"

interface OrderSummaryProps {
  cartItems: CartItem[]
  subtotal: number
  shippingFee: number
  appliedCoupon: CouponData | null
  setAppliedCoupon: (coupon: CouponData | null) => void
  discountAmount: number
  setDiscountAmount: (amount: number) => void
  total: number
}

export default function OrderSummary({
  cartItems,
  subtotal,
  shippingFee,
  appliedCoupon,
  setAppliedCoupon,
  discountAmount,
  setDiscountAmount,
  total,
}: OrderSummaryProps) {
  const [couponCode, setCouponCode] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleCouponApply = async () => {
    if (!couponCode.trim()) {
      setErrorMessage("Please enter a coupon code")
      return
    }

    setIsValidating(true)
    setErrorMessage("")

    try {
      const result = await validateCoupon(couponCode, subtotal)

      if (result.valid && result.coupon) {
        setAppliedCoupon(result.coupon)
        setDiscountAmount(result.discountAmount || 0)
        toast.success(result.message)
        setCouponCode("")
      } else {
        setErrorMessage(result.message)
        toast.error(result.message)
      }
    } catch (error) {
      setErrorMessage("Failed to verify coupon")
      console.error("Coupon validation error:", error)
    } finally {
      setIsValidating(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setDiscountAmount(0)
    toast.warning("Coupon removed")
  }

  return (
    <div className="border rounded-lg p-6 space-y-4 sticky top-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Order Summary</h2>
        <Link href="/cart">
          <Button
            variant="ghost"
            size="sm"
            className="text-brand hover:text-brand/80 -mr-2 cursor-pointer transition-all duration-150 active:scale-95"
          >
            <PenSquare className="h-4 w-4 mr-1" />
          </Button>
        </Link>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-3">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-16 h-16 relative flex-shrink-0 border rounded-md overflow-hidden">
              <Image
                src={
                  Array.isArray(item.image) && item.image.length > 0
                    ? item.image[0]
                    : typeof item.image === "string" &&
                      item.image &&
                      item.image !== "null"
                    ? item.image
                    : "/placeholder.png"
                }
                alt={item.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium line-clamp-1">{item.name}</p>
              <div className="flex items-center text-sm text-gray-500 gap-1">
                <span>Qty: {item.quantity}</span>
                {item.potency && <span>• {item.potency}</span>}
                {item.packSize && <span>• {item.packSize}</span>}
              </div>
              <p className="text-sm font-medium">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="mb-4">
          <h3 className="font-medium mb-2 flex items-center gap-1.5">
            <Tag className="h-4 w-4" />
            <span>Apply Coupon</span>
          </h3>

          {appliedCoupon ? (
            <div className="flex items-center justify-between border border-green-200 rounded-md p-3 bg-green-50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium text-green-700">
                    {appliedCoupon.code}
                  </p>
                  <p className="text-xs text-green-600">
                    {appliedCoupon.description ||
                      (appliedCoupon.discountType === "PERCENTAGE"
                        ? `${appliedCoupon.discountAmount}% off`
                        : `₹${appliedCoupon.discountAmount} off`)}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemoveCoupon}
                className="cursor-pointer"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="uppercase"
              />
              <Button
                onClick={handleCouponApply}
                disabled={isValidating || !couponCode}
                className="cursor-pointer"
              >
                {isValidating ? "Checking..." : "Apply"}
              </Button>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-1.5 mt-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatCurrency(shippingFee)}</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between font-medium text-lg pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
