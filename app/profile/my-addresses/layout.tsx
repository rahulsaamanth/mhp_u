import React from "react"

export const metadata = {
  title: "My Addresses | HomeoSouth",
  description: "Manage your delivery addresses on HomeoSouth.",
}

export default function AddressesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
