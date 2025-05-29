"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function useCrossTabAuthDetection(redirectPath = "/") {
  const router = useRouter()

  useEffect(() => {
    // Listen for auth events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_completed") {
        router.push(redirectPath)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [router, redirectPath])

  return null
}
