import React from "react"

export const metadata = {
  title: "My Profile | HomeoSouth",
  description: "Manage your profile on HomeoSouth.",
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
