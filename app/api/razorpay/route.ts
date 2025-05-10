import Razorpay from "razorpay"
import { NextResponse } from "next/server"

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const { amount, orderId } = await request.json()

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: orderId,
    })

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
    })
  } catch (error) {
    console.error("Razorpay order creation failed:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create payment order" },
      { status: 500 }
    )
  }
}
