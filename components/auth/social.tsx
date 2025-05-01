"use client"

import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { signIn } from "next-auth/react"
import { useState } from "react"

interface SignInModalProps {
  callbackUrl?: string
}

export function Social({ callbackUrl }: SignInModalProps) {
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true)

      // Check if there are items in local cart that need to be merged
      const hasLocalCart =
        typeof window !== "undefined" &&
        localStorage.getItem("cart-storage") &&
        JSON.parse(localStorage.getItem("cart-storage") || "{}")?.state?.items
          ?.length > 0

      // Store a flag to indicate cart merging is needed after login
      if (hasLocalCart) {
        sessionStorage.setItem("needs_cart_merge", "true")
      }

      // Proceed with Google sign in
      await signIn("google", { redirectTo: callbackUrl })
    } catch (error) {
      console.error("Login error:", error)
      setIsLoggingIn(false)
    }
  }

  return (
    <Button
      size={"lg"}
      className="w-full cursor-pointer"
      variant={"outline"}
      onClick={handleGoogleLogin}
      disabled={isLoggingIn}
    >
      <Icon
        icon="flat-color-icons:google"
        width="24"
        height="24"
        className="mr-2"
      />
      {isLoggingIn ? "Connecting..." : "Continue with Google"}
    </Button>
  )
}
