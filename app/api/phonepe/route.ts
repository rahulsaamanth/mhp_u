import { NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const {
      amount,
      orderId,
      merchantTransactionId,
      customerPhone,
      customerEmail,
    } = await request.json()

    // PhonePe Pay API payload
    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID!,
      merchantTransactionId,
      merchantUserId: `MUID${Date.now()}`,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/phonepe/callback?orderId=${orderId}`,
      redirectMode: "POST",
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/phonepe/callback`,
      mobileNumber: customerPhone,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    }

    // Convert payload to Base64
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    )

    // Calculate checksum (X-VERIFY header)
    // SHA256(base64 encoded payload + "/pg/v1/pay" + salt key) + "###" + salt index
    const salt = process.env.PHONEPE_SALT_KEY || ""
    const saltIndex = process.env.PHONEPE_SALT_INDEX || "1"
    const string = encodedPayload + "/pg/v1/pay" + salt
    const sha256 = crypto.createHash("sha256").update(string).digest("hex")
    const checksum = sha256 + "###" + saltIndex

    // Make a request to PhonePe API
    const response = await fetch(
      `${
        process.env.PHONEPE_API_BASE_URL ||
        "https://api.phonepe.com/apis/hermes"
      }/pg/v1/pay`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
        body: JSON.stringify({
          request: encodedPayload,
        }),
      }
    )

    const responseData = await response.json()

    if (responseData.success) {
      return NextResponse.json({
        success: true,
        data: responseData.data,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: responseData.message || "Failed to initiate payment",
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("PhonePe payment initiation failed:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create payment order" },
      { status: 500 }
    )
  }
}
