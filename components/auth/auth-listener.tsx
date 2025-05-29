"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"

export function AuthListener() {
  const { status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      // Clear any pending magic link state when authenticated from any source
      localStorage.removeItem("magic_link_requested")
      localStorage.removeItem("magic_link_email")

      // Broadcast authentication to other tabs
      localStorage.setItem("auth_completed", Date.now().toString())

      // Clean up after a brief delay
      setTimeout(() => {
        localStorage.removeItem("auth_completed")
      }, 5000)
    }
  }, [status])

  return null
}
