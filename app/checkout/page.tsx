"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUserCart } from "@/app/cart/_lib/actions"
import { CartItem } from "@/store/cart"
import CheckoutForm from "./_components/checkout-form"
import OrderSummary from "./_components/order-summary"
import { CouponData } from "./_lib/actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    async function loadCart() {
      setIsLoading(true)
      try {
        const { items } = await getUserCart()

        if (!items || items.length === 0) {
          router.push("/cart")
          return
        }

        setCartItems(items)
      } catch (error) {
        console.error("Failed to load cart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [router])

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  const shippingFee = 50

  const total = subtotal + shippingFee - discountAmount

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 text-center min-h-[60vh]">
        <p>Loading checkout...</p>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-10 text-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm cartItems={cartItems} appliedCoupon={appliedCoupon} />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            shippingFee={shippingFee}
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
            discountAmount={discountAmount}
            setDiscountAmount={setDiscountAmount}
            total={total}
          />
        </div>
      </div>
    </div>
  )
}
