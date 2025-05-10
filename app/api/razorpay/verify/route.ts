import { db } from "@/db/db"
import { payment, cart, order } from "@rahulsaamanth/mhp-schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      await request.json()

    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest("hex")

    if (signature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      )
    }

    const [updatedPayment] = await db
      .update(payment)
      .set({
        status: "PAID",
        paymentType: "UPI",
        gatewayPaymentId: razorpay_payment_id,
        updatedAt: new Date(),
      })
      .where(eq(payment.gatewayOrderId, razorpay_order_id))
      .returning()

    if (!updatedPayment) {
      return NextResponse.json(
        { success: false, message: "Payment record not found" },
        { status: 404 }
      )
    }

    const [orderData] = await db
      .select()
      .from(order)
      .where(eq(order.id, updatedPayment.orderId))
      .limit(1)

    if (orderData?.userId) {
      await db.delete(cart).where(eq(cart.userId, orderData.userId))
    }

    return NextResponse.json({
      success: true,
      orderId: updatedPayment.orderId,
    })
  } catch (error) {
    console.error("Payment verification failed:", error)
    return NextResponse.json(
      { success: false, message: "Payment verification failed" },
      { status: 500 }
    )
  }
}
