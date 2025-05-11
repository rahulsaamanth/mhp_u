"use client"

import { CheckCircle2 } from "lucide-react"
import styles from "@/app/styles/order-confirmation-header.module.css"

interface OrderConfirmationHeaderProps {
  invoiceNumber: string
}

export function OrderConfirmationHeader({
  invoiceNumber,
}: OrderConfirmationHeaderProps) {
  return (
    <div className="bg-white py-12 shadow-sm">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div
              className={`w-20 h-20 rounded-full bg-green-50 flex items-center justify-center ${styles.animateCheckmark}`}
            >
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            Thank you for your order!
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-lg">
            Your order #{invoiceNumber} has been confirmed. We'll send you
            shipping updates via email.
          </p>
        </div>
      </div>
    </div>
  )
}
