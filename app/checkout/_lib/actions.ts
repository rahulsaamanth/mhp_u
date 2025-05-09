"use server"

import { db } from "@/db/db"
import { currentUser } from "@/lib/auth"
import { CartItem } from "@/store/cart"
import {
  address,
  cart,
  discountCode,
  order,
  orderDetails,
  payment,
} from "@rahulsaamanth/mhp-schema"
import { and, eq, gt, isNull, or } from "drizzle-orm"
import Razorpay from "razorpay"

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export type CouponData = {
  id: string
  code: string
  description: string | null
  discountAmount: number
  discountType: "PERCENTAGE" | "FIXED"
  isActive: boolean
  allProducts: boolean
  minimumOrderValue: number
  limit: number
  usageCount: number
  expiresAt: Date | null
}

export async function validateCoupon(code: string, cartTotal: number) {
  try {
    const now = new Date()
    const result = await db.query.discountCode.findFirst({
      where: and(
        eq(discountCode.code, code.toUpperCase()),
        eq(discountCode.isActive, true),
        or(isNull(discountCode.expiresAt), gt(discountCode.expiresAt, now))
      ),
    })

    if (!result) {
      return {
        valid: false,
        message: "Invalid or expired coupon code",
      }
    }

    const coupon: CouponData = {
      ...result,
      minimumOrderValue: result.minimumOrderValue ?? 0,
      limit: result.limit ?? 0,
      usageCount: result.usageCount ?? 0,
    }

    if (cartTotal < coupon.minimumOrderValue) {
      return {
        valid: false,
        message: `Order must be at least ₹${coupon.minimumOrderValue} to use this coupon`,
      }
    }

    if (coupon.limit > 0 && coupon.usageCount >= coupon.limit) {
      return {
        valid: false,
        message: "This coupon has reached its usage limit",
      }
    }

    let discountAmount = 0

    if (coupon.discountType === "PERCENTAGE") {
      discountAmount = (cartTotal * coupon.discountAmount) / 100
    } else {
      discountAmount = coupon.discountAmount
    }

    // Update usage count
    await db
      .update(discountCode)
      .set({ usageCount: (coupon.usageCount ?? 0) + 1 })
      .where(eq(discountCode.id, coupon.id))

    return {
      valid: true,
      coupon,
      discountAmount,
      message: getDiscountMessage(coupon),
    }
  } catch (error) {
    console.error("Error validating coupon:", error)
    return {
      valid: false,
      message: "Failed to validate coupon",
    }
  }
}

function getDiscountMessage(coupon: CouponData) {
  if (coupon.discountType === "PERCENTAGE") {
    return `${coupon.discountAmount}% off on your order`
  } else {
    return `₹${coupon.discountAmount} off on your order`
  }
}

export type CheckoutFormData = {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  paymentMethod: "COD" | "ONLINE"
}

export type CreateOrderResponse = {
  orderId: string | null
  razorpayOrderId: string | null
  amount: number
  success: boolean
  message: string
}

export async function processCheckout(
  cartItems: CartItem[],
  data: CheckoutFormData,
  appliedCoupon: CouponData | null
): Promise<CreateOrderResponse> {
  const user = await currentUser()
  if (!user?.id) {
    return {
      success: false,
      message: "Please login to complete checkout",
      orderId: null,
      amount: 0,
      razorpayOrderId: null,
    }
  }

  try {
    // Calculate order totals
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)
    const shippingCost = 50 // Fixed shipping cost
    const discountAmount = appliedCoupon?.discountAmount || 0
    const tax = 0 // Add tax calculation if needed
    const totalAmount = subtotal + shippingCost - discountAmount + tax

    // First create the shipping address
    const [_address] = await db
      .insert(address)
      .values({
        userId: user.id,
        street: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.pincode,
        type: "SHIPPING",
      })
      .returning()

    // Create the order
    const [_order] = await db
      .insert(order)
      .values({
        userId: user.id,
        customerName: data.fullName,
        customerEmail: data.email,
        customerPhone: data.phone,
        orderType: "ONLINE", // Since it's an online order even if COD
        deliveryStatus: "PROCESSING",
        paymentStatus: "PENDING",
        addressId: _address.id,
        subtotal: subtotal,
        shippingCost: shippingCost,
        discount: discountAmount,
        tax: tax,
        totalAmountPaid: totalAmount,
        discountCodeId: appliedCoupon?.id,
        orderDate: new Date(),
      })
      .returning()

    // Create order details for each item
    for (const item of cartItems) {
      await db.insert(orderDetails).values({
        orderId: _order.id,
        productVariantId: item.variantId,
        originalPrice: item.price,
        unitPrice: item.price,
        quantity: item.quantity,
        discountAmount: 0, // Add item-level discount if needed
        taxAmount: 0, // Add item-level tax if needed
      })
    }

    // For COD orders, create a payment record
    if (data.paymentMethod === "COD") {
      await db.insert(payment).values({
        orderId: _order.id,
        amount: totalAmount,
        status: "PENDING",
        paymentType: "CASH_ON_DELIVERY",
      })

      // Clear the cart after successful order creation
      await db.delete(cart).where(eq(cart.userId, user.id))

      return {
        success: true,
        orderId: _order.id,
        message: "Order placed successfully! You can pay cash on delivery.",
        razorpayOrderId: null,
        amount: totalAmount,
      }
    }

    // For online payments, create Razorpay order
    if (data.paymentMethod === "ONLINE") {
      try {
        // Create Razorpay order directly using the SDK
        const razorpayOrder = await razorpay.orders.create({
          amount: totalAmount * 100, // Amount in paise
          currency: "INR",
          receipt: _order.id,
          notes: {
            orderId: _order.id,
          },
        })

        // Create payment record for Razorpay
        await db.insert(payment).values({
          orderId: _order.id,
          amount: totalAmount,
          status: "PENDING",
          paymentType: "UPI",
          gateway: "RAZORPAY",
          gatewayOrderId: razorpayOrder.id,
        })

        return {
          success: true,
          orderId: _order.id,
          razorpayOrderId: razorpayOrder.id,
          amount: totalAmount,
          message: "Order created. Please complete payment.",
        }
      } catch (error) {
        console.error("Razorpay order creation failed:", error)
        // Delete the order and address if payment creation fails
        await db.delete(order).where(eq(order.id, _order.id))
        await db.delete(address).where(eq(address.id, _address.id))

        return {
          success: false,
          orderId: null,
          razorpayOrderId: null,
          amount: 0,
          message: "Failed to create payment order",
        }
      }
    }

    return {
      success: false,
      orderId: null,
      razorpayOrderId: null,
      amount: 0,
      message: "Invalid payment method",
    }
  } catch (error) {
    console.error("Checkout failed:", error)
    return {
      success: false,
      amount: 0,
      orderId: null,
      razorpayOrderId: null,
      message: "Something went wrong while processing your order",
    }
  }
}
