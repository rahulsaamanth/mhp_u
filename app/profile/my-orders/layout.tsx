import React from "react"

export const metadata = {
  title: "My Orders | HomeoSouth",
  description: "View your order history on HomeoSouth.",
}

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
