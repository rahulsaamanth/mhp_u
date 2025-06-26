import { db } from "@/db/db"
import { payment, order, cart } from "@rahulsaamanth/mhp-schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { url } = request
    const searchParams = new URL(url).searchParams
    const orderId = searchParams.get("orderId")
    const data = await request.json()

    // Verify the response from PhonePe
    // The actual verification depends on PhonePe's response format
    const {
      merchantTransactionId,
      transactionId,
      amount,
      merchantId,
      responseCode,
      paymentState,
      payResponseCode,
      paymentInstrument,
    } = data.response

    // Validate checksum from PhonePe (implementation depends on PhonePe's API)
    // This is a placeholder for the actual checksum validation
    const isValid = true // Replace with actual validation logic

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      )
    }

    // Check response codes
    if (responseCode !== "SUCCESS" || payResponseCode !== "SUCCESS") {
      return NextResponse.json(
        { success: false, message: "Payment failed" },
        { status: 400 }
      )
    }

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Missing order ID" },
        { status: 400 }
      )
    }

    // Update payment record
    const [updatedPayment] = await db
      .update(payment)
      .set({
        status: "PAID",
        paymentType: "UPI",
        gatewayPaymentId: transactionId,
        updatedAt: new Date(),
      })
      .where(eq(payment.orderId, orderId))
      .returning()

    if (!updatedPayment) {
      return NextResponse.json(
        { success: false, message: "Payment record not found" },
        { status: 404 }
      )
    }

    // Update order payment status
    await db
      .update(order)
      .set({
        paymentStatus: "PAID",
      })
      .where(eq(order.id, orderId))

    // Get the user ID from the order to clear their cart
    const [orderData] = await db
      .select()
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1)

    if (orderData?.userId) {
      await db.delete(cart).where(eq(cart.userId, orderData.userId))
    }

    // Redirect to order confirmation page
    return NextResponse.redirect(
      new URL(`/order-confirmation/${orderId}`, request.url)
    )
  } catch (error) {
    console.error("PhonePe payment verification failed:", error)
    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 }
    )
  }
}
