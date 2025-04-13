"use server"

import { db } from "@/db/db"
import { CartItem } from "@/store/cart"
import { currentUser } from "@/lib/auth"
import { generateId } from "@/lib/generate-id"
import { eq } from "drizzle-orm"
import { cart } from "@rahulsaamanth/mhp-schema"

// Temporary coupon data (in a real app, this would be in the database)
const VALID_COUPONS: CouponData[] = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 500,
    maxDiscountAmount: 500,
  },
  {
    code: "MHP100OFF",
    discountType: "fixed",
    discountValue: 100,
    minOrderValue: 1000,
    maxDiscountAmount: 100,
  },
  {
    code: "FREESHIP",
    discountType: "shipping",
    discountValue: 100,
    minOrderValue: 500,
    maxDiscountAmount: 100,
  },
  {
    code: "SUMMER20",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 1500,
    maxDiscountAmount: 1000,
  },
]

export type CouponData = {
  code: string
  discountType: "percentage" | "fixed" | "shipping"
  discountValue: number
  minOrderValue: number
  maxDiscountAmount: number
}

export type CheckoutFormData = {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  paymentMethod: "cod" | "online"
}

export async function validateCoupon(code: string, cartTotal: number) {
  // Simulate a delay for API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  const coupon = VALID_COUPONS.find(
    (c) => c.code.toLowerCase() === code.toLowerCase()
  )

  if (!coupon) {
    return {
      valid: false,
      message: "Invalid coupon code",
    }
  }

  if (cartTotal < coupon.minOrderValue) {
    return {
      valid: false,
      message: `Order must be at least ₹${coupon.minOrderValue} to use this coupon`,
    }
  }

  let discountAmount = 0

  if (coupon.discountType === "percentage") {
    discountAmount = (cartTotal * coupon.discountValue) / 100
    // Cap the discount at the maximum amount
    if (discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount
    }
  } else if (
    coupon.discountType === "fixed" ||
    coupon.discountType === "shipping"
  ) {
    discountAmount = coupon.discountValue
  }

  return {
    valid: true,
    coupon,
    discountAmount,
    message: `Coupon applied: ${getDiscountMessage(coupon)}`,
  }
}

function getDiscountMessage(coupon: CouponData) {
  if (coupon.discountType === "percentage") {
    return `${coupon.discountValue}% off (Max ₹${coupon.maxDiscountAmount})`
  } else if (coupon.discountType === "fixed") {
    return `₹${coupon.discountValue} off`
  } else if (coupon.discountType === "shipping") {
    return `Free shipping (worth ₹${coupon.discountValue})`
  }
  return ""
}

export async function processCheckout(
  cartItems: CartItem[],
  data: CheckoutFormData,
  appliedCoupon: CouponData | null
) {
  const user = await currentUser()
  if (!user?.id) {
    return { success: false, message: "Please login to complete checkout" }
  }

  try {
    // In a real app, this would:
    // 1. Create an order in the database
    // 2. Process payment or mark as COD
    // 3. Clear the user's cart
    // 4. Send confirmation emails

    // For now, just clear the cart
    await db.delete(cart).where(eq(cart.userId, user.id))

    return {
      success: true,
      orderId: generateId(),
      message: "Order placed successfully!",
    }
  } catch (error) {
    console.error("Checkout failed:", error)
    return {
      success: false,
      message: "Something went wrong while processing your order",
    }
  }
}
