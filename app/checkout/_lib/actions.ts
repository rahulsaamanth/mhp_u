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
import crypto from "crypto"

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
  paymentMethod: "COD" | "PHONEPE"
}

export type CreateOrderResponse = {
  orderId: string | null
  amount: number
  success: boolean
  message: string
  phonePeData?: {
    merchantTransactionId: string
    merchantUserId: string
    checksum: string
    [key: string]: any
  }
}

export async function processCheckout(
  cartItems: CartItem[],
  data: CheckoutFormData,
  appliedCoupon: CouponData | null
): Promise<CreateOrderResponse> {
  const user = await currentUser()
  if (!user?.id) throw new Error("User not found")

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const shippingCost = 0
  const tax = 0
  let discountAmount = 0

  if (appliedCoupon) {
    if (appliedCoupon.discountType === "PERCENTAGE") {
      discountAmount = (subtotal * appliedCoupon.discountAmount) / 100
    } else {
      discountAmount = appliedCoupon.discountAmount
    }
  }

  const totalAmount = subtotal + shippingCost + tax - discountAmount

  try {
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

    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}-${String(Math.floor(Math.random() * 100000)).padStart(
      5,
      "0"
    )}`

    const [_order] = await db
      .insert(order)
      .values({
        userId: user.id,
        customerName: data.fullName,
        customerEmail: data.email,
        customerPhone: data.phone,
        orderType: "ONLINE",
        deliveryStatus: "PROCESSING",
        paymentStatus: "PENDING",
        addressId: _address.id,
        subtotal: subtotal,
        shippingCost: shippingCost,
        discount: discountAmount,
        tax: tax,
        totalAmountPaid: totalAmount,
        discountCodeId: appliedCoupon?.id,
        // orderDate: new Date(),
        invoiceNumber: invoiceNumber,
      })
      .returning()

    for (const item of cartItems) {
      await db.insert(orderDetails).values({
        orderId: _order.id,
        productVariantId: item.variantId,
        originalPrice: item.price,
        unitPrice: item.price,
        quantity: item.quantity,
        discountAmount: 0,
        taxAmount: 0,
      })
    }

    if (data.paymentMethod === "COD") {
      await db.insert(payment).values({
        orderId: _order.id,
        amount: totalAmount,
        status: "PENDING",
        paymentType: "CASH_ON_DELIVERY",
      })

      await db.delete(cart).where(eq(cart.userId, user.id))

      return {
        success: true,
        orderId: _order.id,
        message: "Order placed successfully! You can pay cash on delivery.",
        amount: totalAmount,
      }
    } else if (data.paymentMethod === "PHONEPE") {
      // Generate a unique transaction ID
      const merchantTransactionId = `PPTX${Date.now()}${Math.floor(
        Math.random() * 1000
      )}`
      const merchantUserId = `MUID${user.id}`

      // Create payment record with PENDING status
      await db.insert(payment).values({
        orderId: _order.id,
        amount: totalAmount,
        status: "PENDING",
        paymentType: "UPI",
        gatewayOrderId: merchantTransactionId, // Using the existing field for transaction ID
      })

      // For PhonePe integration, we need to generate a checksum
      // This is a simplified version; in production, use the proper crypto methods
      const payload = {
        merchantId: process.env.PHONEPE_MERCHANT_ID!,
        merchantTransactionId,
        merchantUserId,
        amount: totalAmount * 100, // PhonePe expects amount in paise
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/phonepe/callback?orderId=${_order.id}`,
        redirectMode: "POST",
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/phonepe/callback`,
        mobileNumber: data.phone,
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      }

      // In a real implementation, generate the checksum as per PhonePe's documentation
      // This is a placeholder. You'll need to implement the proper checksum generation.
      const salt = process.env.PHONEPE_SALT_KEY || ""
      const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
        "base64"
      )
      const string = encodedPayload + "/pg/v1/pay" + salt
      const sha256 = crypto.createHash("sha256").update(string).digest("hex")
      const checksum = sha256 + "###" + process.env.PHONEPE_SALT_INDEX

      return {
        success: true,
        orderId: _order.id,
        message: "Redirecting to payment gateway...",
        amount: totalAmount,
        phonePeData: {
          merchantTransactionId,
          merchantUserId,
          checksum,
          payload: encodedPayload,
        },
      }
    }

    // Default case - should never reach here with proper validation
    return {
      success: false,
      orderId: null,
      amount: 0,
      message: "Invalid payment method",
    }
  } catch (error) {
    console.error("Checkout failed:", error)
    return {
      success: false,
      amount: 0,
      orderId: null,
      message: "Something went wrong while processing your order",
    }
  }
}
